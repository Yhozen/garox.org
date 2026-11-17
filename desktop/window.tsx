"use client";

import { motion, useDragControls } from "motion/react";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { ModeProvider, useDesktop, WIDE_SCREEN } from "./desktop-context";
import type { FsNode } from "./fs";
import { arrive } from "./zoom";

type WindowApi = { node: FsNode; focused: boolean; close: () => void };

const WindowContext = createContext<WindowApi | null>(null);

/** Lets an app read and control the window it is rendered in. */
export function useWindow(): WindowApi {
  const api = useContext(WindowContext);
  if (!api) throw new Error("useWindow must be used inside a <Window>");
  return api;
}

/** Deterministic cascade so server and client agree on where a window starts. */
function defaultPosition(index: number) {
  const step = Math.max(index, 0) % 8;
  return { x: 96 + step * 32, y: 32 + step * 24 };
}

const box =
  "absolute size-[11px] border border-black bg-white shadow-[0_0_0_1px_#fff] active:bg-black max-sm:size-[19px] after:absolute after:-inset-4";

/**
 * A System 7 title bar: close box on the left, zoom box on the right, and
 * pinstripes when active. Shared by windows and the fullscreen view.
 */
export function TitleBar({
  title,
  active,
  onClose,
  onZoom,
  zoomLabel,
  onPointerDown,
  className,
}: {
  title: string;
  active: boolean;
  onClose: () => void;
  onZoom?: () => void;
  zoomLabel?: string;
  onPointerDown?: (event: PointerEvent<HTMLElement>) => void;
  className?: string;
}) {
  const stop = (event: PointerEvent) => event.stopPropagation();
  return (
    <header
      onPointerDown={onPointerDown}
      className={cn(
        "relative flex h-5 shrink-0 items-center justify-center border-b border-black max-sm:h-11 touch-none select-none",
        className,
      )}
    >
      {active && (
        <>
          {/* Four pinstripes (five on phones), inset from the frame; only the active window gets them. */}
          <span
            aria-hidden
            className="absolute inset-x-0.5 top-1/2 h-[10px] -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,#000_0_1px,transparent_1px_3px)] max-sm:h-[13px]"
          />
          <button
            type="button"
            aria-label={`Close ${title}`}
            onPointerDown={stop}
            onClick={onClose}
            className={cn(box, "left-2 max-sm:left-3")}
          />
          {onZoom && (
            // The zoom box: a small box drawn inside the top-left of the big one.
            <button
              type="button"
              aria-label={zoomLabel ?? `Zoom ${title}`}
              onPointerDown={stop}
              onClick={onZoom}
              className={cn(box, "right-2 max-sm:hidden group")}
            >
              <span className="absolute left-0 top-0 size-[6px] border-r border-b border-black group-active:border-white" />
            </button>
          )}
        </>
      )}
      <h2 className="relative bg-white px-1.5 text-[13px] leading-none font-bold font-chicago max-sm:text-base">
        {title}
      </h2>
    </header>
  );
}

export function Window({
  node,
  width,
  height = 400,
  zIndex,
  focused,
  constraints,
  children,
}: {
  node: FsNode;
  width: number;
  /** Maximum content height in pixels on larger screens. */
  height?: number;
  zIndex: number;
  focused: boolean;
  constraints: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const { fs, close, focus, zoom } = useDesktop();
  const controls = useDragControls();
  const frame = useRef<HTMLElement>(null);
  const initial = useMemo(() => defaultPosition(fs.indexOf(node.path)), [fs, node.path]);
  const api = useMemo(
    () => ({ node, focused, close: () => close(node.path, frame.current) }),
    [node, focused, close],
  );

  // If this window was just opened from an icon or un-zoomed, play the zoom rects into it.
  useLayoutEffect(() => {
    if (frame.current) arrive(node.path, frame.current);
  }, [node.path]);

  return (
    <motion.section
      ref={frame}
      aria-label={node.name}
      drag
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragConstraints={constraints}
      dragElastic={0}
      initial={initial}
      onPointerDownCapture={() => focus(node.path)}
      className={cn(
        // System 7 frame with our own heavier drop shadow.
        "absolute top-0 left-0 flex flex-col bg-white border border-black shadow-[4px_4px_0_#000]",
        // Phones: the front window fills the desktop and the others wait behind it.
        "max-sm:inset-0 max-sm:w-auto! max-sm:transform-none! max-sm:border-0 max-sm:shadow-none",
        !focused && "max-sm:hidden",
      )}
      style={{ width, zIndex, "--content-height": `${height}px` } as React.CSSProperties}
    >
      <TitleBar
        title={node.name}
        active={focused}
        onClose={api.close}
        onZoom={() => frame.current && zoom(node.path, frame.current)}
        onPointerDown={(event) => {
          // Phones get full-screen sheets that don't drag.
          if (matchMedia(WIDE_SCREEN).matches) controls.start(event);
        }}
        className="sm:cursor-grab sm:active:cursor-grabbing"
      />
      <div className="p-4 max-h-(--content-height) overflow-auto max-sm:flex-1 max-sm:max-h-none max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
        <ModeProvider value="window">
          <WindowContext value={api}>{children}</WindowContext>
        </ModeProvider>
      </div>
    </motion.section>
  );
}
