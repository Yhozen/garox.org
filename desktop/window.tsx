"use client";

import { motion, useDragControls } from "motion/react";
import { createContext, useContext, useMemo, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { useDesktop } from "./desktop-context";
import type { FsNode } from "./fs";

type WindowApi = { node: FsNode; focused: boolean; close: () => void };

const WindowContext = createContext<WindowApi | null>(null);

/** Lets an app read and control the window it is rendered in. */
export function useWindow(): WindowApi {
  const api = useContext(WindowContext);
  if (!api) throw new Error("useWindow must be used inside a <Window>");
  return api;
}

/** Below Tailwind's `sm` breakpoint windows are full-screen sheets that don't drag. */
const DRAGGABLE = "(min-width: 40rem)";

/** Deterministic cascade so server and client agree on where a window starts. */
function defaultPosition(index: number) {
  const step = Math.max(index, 0) % 8;
  return { x: 96 + step * 32, y: 32 + step * 24 };
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
  const { fs, close, focus } = useDesktop();
  const controls = useDragControls();
  const initial = useMemo(() => defaultPosition(fs.indexOf(node.path)), [fs, node.path]);
  const api = useMemo(
    () => ({ node, focused, close: () => close(node.path) }),
    [node, focused, close],
  );

  return (
    <motion.section
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
      <header
        onPointerDown={(event) => {
          if (matchMedia(DRAGGABLE).matches) controls.start(event);
        }}
        className="relative flex h-5 shrink-0 items-center justify-center border-b border-black max-sm:h-11 sm:cursor-grab sm:active:cursor-grabbing touch-none select-none"
      >
        {focused && (
          <>
            {/* Four pinstripes (five on phones), inset from the frame; only the active window gets them. */}
            <span
              aria-hidden
              className="absolute inset-x-0.5 top-1/2 h-[10px] -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,#000_0_1px,transparent_1px_3px)] max-sm:h-[13px]"
            />
            <button
              type="button"
              aria-label={`Close ${node.name}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={api.close}
              className="absolute left-2 size-[11px] border border-black bg-white shadow-[0_0_0_1px_#fff] active:bg-black max-sm:left-3 max-sm:size-[19px] after:absolute after:-inset-4"
            />
          </>
        )}
        <h2 className="relative bg-white px-1.5 text-[13px] leading-none font-bold font-chicago max-sm:text-base">
          {node.name}
        </h2>
      </header>
      <div className="p-4 max-h-(--content-height) overflow-auto max-sm:flex-1 max-sm:max-h-none max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
        <WindowContext value={api}>{children}</WindowContext>
      </div>
    </motion.section>
  );
}
