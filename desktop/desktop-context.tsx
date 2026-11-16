"use client";

import { useRouter } from "next/navigation";
import type { useQueryStates } from "nuqs";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useTransition,
  type ReactNode,
  type RefObject,
} from "react";
import { createFileSystem, pathFromUrl, type FileSystem, type PostMeta } from "./fs";
import { desktopUrl, loadWindows, type windowsParam } from "./search-params";
import { depart, launch } from "./zoom";

type SetWindows = ReturnType<typeof useQueryStates<typeof windowsParam>>[1];

/** Where something was opened from: on the desktop/in a window, or fullscreen. */
export type Mode = "window" | "fullscreen";

type Desktop = {
  fs: FileSystem;
  /** The desktop area below the menu bar; fullscreen fills it. */
  area: RefObject<HTMLElement | null>;
  /** True while a fullscreen page is loading. */
  pending: boolean;
  /** Opens a node. Posts, and anything opened from a fullscreen page, open fullscreen. */
  open: (path: string, options?: { from?: Element | null; mode?: Mode }) => void;
  close: (path: string, from?: Element | null) => void;
  focus: (path: string) => void;
  /** Window → fullscreen. */
  zoom: (path: string, from: Element) => void;
  /** Fullscreen → window. */
  unzoom: (from: Element) => void;
  closeFullscreen: (from?: Element | null) => void;
  /** File → Close Window: the fullscreen page if there is one, else the front window. */
  closeFront: () => void;
  /** Lets the component that reads `?w` (inside Suspense) hand over its setter. */
  connect: (set: SetWindows) => void;
};

const DesktopContext = createContext<Desktop | null>(null);

const toFront = (stack: string[], path: string) => [...stack.filter((p) => p !== path), path];

/**
 * The URL is the whole desktop: the path is what's open fullscreen on top,
 * and `?w` (nuqs) is the stack of windows behind it.
 *
 * - Windows change `?w` only, shallowly: no request, instant.
 * - Fullscreen changes the path, which is a normal navigation to a static
 *   page — so every post and app has a real, shareable, prerendered URL.
 *
 * This provider sits above that static page, so it never reads the URL
 * while rendering (that would push the page out of the prerendered HTML).
 * Actions read `window.location` when they run instead, and the `?w`
 * setter is handed over by the windows layer once it mounts.
 */
export function DesktopProvider({ posts, children }: { posts: PostMeta[]; children: ReactNode }) {
  const fs = useMemo(() => createFileSystem(posts), [posts]);
  const router = useRouter();
  const area = useRef<HTMLElement>(null);
  const setter = useRef<SetWindows | null>(null);
  const [pending, startTransition] = useTransition();

  const current = useCallback(
    () => ({
      fullscreen: pathFromUrl(location.pathname),
      windows: fs.openWindows(loadWindows(location.search).w),
    }),
    [fs],
  );

  const setWindows = useCallback(
    (update: (stack: string[]) => string[], history: "push" | "replace") => {
      if (setter.current) {
        void setter.current((prev) => ({ w: update(fs.openWindows(prev.w)) }), { history });
        return;
      }
      // Before the windows layer has mounted, write the URL directly.
      const url = desktopUrl(location.pathname, { w: update(current().windows) });
      window.history[history === "push" ? "pushState" : "replaceState"](null, "", url);
    },
    [fs, current],
  );

  const goFullscreen = useCallback(
    (path: string, from?: DOMRect) => {
      const { fullscreen, windows } = current();
      if (fullscreen === path) return;
      const to = area.current?.getBoundingClientRect();
      if (from && to) launch(path, from, to);
      const url = desktopUrl(`/${path}`, { w: windows.filter((p) => p !== path) });
      startTransition(() => router.push(url));
    },
    [current, router],
  );

  const value = useMemo<Desktop>(() => {
    const rect = (el?: Element | null) => el?.getBoundingClientRect();

    const close = (path: string, from?: Element | null) => {
      const r = rect(from);
      if (r) depart(path, r);
      setWindows((stack) => stack.filter((p) => p !== path), "replace");
    };

    const closeFullscreen = (from?: Element | null) => {
      const { fullscreen, windows } = current();
      if (!fullscreen) return;
      const r = rect(from ?? area.current);
      if (r) depart(fullscreen, r);
      startTransition(() => router.replace(desktopUrl("/", { w: windows })));
    };

    return {
      fs,
      area,
      pending,
      open(path, { from, mode = "window" } = {}) {
        const node = fs.lookup(path);
        if (!node) return;
        if (node.type === "link") {
          window.open(node.url, "_blank", "noopener,noreferrer");
          return;
        }
        if (node.type === "document" || mode === "fullscreen") {
          goFullscreen(path, rect(from));
          return;
        }
        const alreadyOpen = current().windows.includes(path);
        const r = rect(from);
        if (r && !alreadyOpen) launch(path, r);
        setWindows((stack) => toFront(stack, path), alreadyOpen ? "replace" : "push");
      },
      close,
      focus(path) {
        if (current().windows.at(-1) === path) return;
        setWindows((stack) => toFront(stack, path), "replace");
      },
      zoom(path, from) {
        goFullscreen(path, rect(from));
      },
      unzoom(from) {
        const { fullscreen, windows } = current();
        if (!fullscreen || !fs.lookup(fullscreen)) return;
        launch(fullscreen, from.getBoundingClientRect());
        startTransition(() => router.push(desktopUrl("/", { w: toFront(windows, fullscreen) })));
      },
      closeFullscreen,
      closeFront() {
        const { fullscreen, windows } = current();
        if (fullscreen) closeFullscreen();
        else if (windows.length > 0) close(windows.at(-1)!);
      },
      connect(set) {
        setter.current = set;
      },
    };
  }, [fs, pending, current, setWindows, goFullscreen, router]);

  return <DesktopContext value={value}>{children}</DesktopContext>;
}

export function useDesktop(): Desktop {
  const desktop = useContext(DesktopContext);
  if (!desktop) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return desktop;
}

const ModeContext = createContext<Mode>("window");

/** Marks content as shown in a window or fullscreen, so links open in kind. */
export const ModeProvider = ModeContext;

export const useMode = () => useContext(ModeContext);
