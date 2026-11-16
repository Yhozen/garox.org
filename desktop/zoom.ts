/**
 * System 7's "zoom rects": when something opens, a trail of outline
 * rectangles grows from where you clicked to where the window will be, then
 * the window appears. Closing plays it in reverse, back into the icon.
 *
 * The outlines are white on a layer blended with `mix-blend-mode:
 * difference`, which inverts whatever is underneath — the same effect as the
 * original XOR drawing, so they read on the dotted desktop, on white windows
 * and on black text alike. (The blend sits on the layer, not the outlines:
 * the layer's z-index isolates its children from the page.)
 *
 * It runs on plain DOM nodes outside React, so the trail keeps playing while
 * windows mount, unmount and routes change underneath it.
 */

/** Rectangles in the trail, and how far apart they start, in ms. */
const RECTS = 12;
const STEP = 16;
/** How long each rectangle stays on screen before fading. */
const LIFE = STEP * 5;
/** Ignore a launch that nothing arrived for (a failed or abandoned navigation). */
const STALE_MS = 3000;

type Box = { x: number; y: number; width: number; height: number };

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

const box = (rect: DOMRect | Box): Box => ({
  x: rect.x,
  y: rect.y,
  width: rect.width,
  height: rect.height,
});

/** A small box at the center of `rect`, for things with no icon to return to. */
const pointIn = (rect: Box): Box => ({
  x: rect.x + rect.width / 2 - 8,
  y: rect.y + rect.height / 2 - 8,
  width: 16,
  height: 16,
});

/**
 * Draws the trail from `from` to `to`. Resolves as the last rectangle lands,
 * which is when the destination should appear.
 *
 * `to` can be a function: each rectangle measures it as it's drawn, so a
 * window that grows while it opens (a post loading in) is still where the
 * trail ends up.
 */
export function zoomRects(
  from: DOMRect | Box,
  to: DOMRect | Box | (() => DOMRect | Box),
  grow = true,
): Promise<void> {
  if (reduceMotion()) return Promise.resolve();
  const a = box(from);
  const target = typeof to === "function" ? () => box(to()) : () => box(to);

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:2147483647;mix-blend-mode:difference";
  document.body.append(layer);

  const draw = (i: number) => {
    const b = target();
    const p = (i + 1) / RECTS;
    // Opening accelerates toward the window, closing decelerates into the icon.
    const t = grow ? p * p : 1 - (1 - p) * (1 - p);
    const lerp = (start: number, end: number) => Math.round(start + (end - start) * t);
    const rect = document.createElement("div");
    rect.style.cssText = [
      "position:absolute",
      `left:${lerp(a.x, b.x)}px`,
      `top:${lerp(a.y, b.y)}px`,
      `width:${Math.max(lerp(a.width, b.width), 2)}px`,
      `height:${Math.max(lerp(a.height, b.height), 2)}px`,
      "border:1px solid #fff",
    ].join(";");
    layer.append(rect);
    rect.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.55 },
        { opacity: 0, offset: 1 },
      ],
      { duration: LIFE, fill: "forwards" },
    );
  };

  // One rectangle per frame step; the layer goes once the last one has faded.
  for (let i = 0; i < RECTS; i++) setTimeout(() => draw(i), i * STEP);
  setTimeout(() => layer.remove(), (RECTS - 1) * STEP + LIFE);
  return new Promise((resolve) => setTimeout(resolve, (RECTS - 1) * STEP + STEP));
}

const launches = new Map<string, { from: Box; done?: Promise<void>; at: number }>();

/**
 * Records that `path` is opening from `from` (an icon, a window, a link).
 * Pass `to` when the destination is already known (fullscreen fills the
 * desktop), so the trail starts on the click instead of after navigation.
 */
export function launch(path: string, from: DOMRect, to?: DOMRect) {
  launches.set(path, {
    from: box(from),
    done: to ? zoomRects(from, to) : undefined,
    at: Date.now(),
  });
}

/**
 * Called by a window or the fullscreen view when it shows `path`. If
 * something launched it, the element stays hidden until the trail lands,
 * then fades in.
 */
export function arrive(path: string, element: HTMLElement) {
  const entry = launches.get(path);
  launches.delete(path);
  if (!entry || Date.now() - entry.at > STALE_MS) return;

  element.style.visibility = "hidden";
  const done = entry.done ?? zoomRects(entry.from, () => element.getBoundingClientRect());
  void done.then(() => {
    element.style.visibility = "";
    if (!reduceMotion()) {
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: "ease-out" });
    }
  });
}

/**
 * Plays a close: the trail shrinks from `from` into the icon of `path`, or
 * of the nearest folder that's visible, or to a point if there's none.
 */
export function depart(path: string, from: DOMRect) {
  void zoomRects(from, iconFor(path) ?? pointIn(box(from)), false);
}

function iconFor(path: string): DOMRect | undefined {
  for (let p = path; p; p = p.slice(0, Math.max(p.lastIndexOf("/"), 0))) {
    const icon = [...document.querySelectorAll<HTMLElement>("[data-node]")].find(
      (el) => el.dataset.node === p && el.checkVisibility(),
    );
    const glyph = icon?.querySelector("svg") ?? icon;
    if (glyph) return glyph.getBoundingClientRect();
  }
  return undefined;
}
