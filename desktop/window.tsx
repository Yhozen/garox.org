"use client";

import { motion, useDragControls } from "motion/react";
import { createContext, useContext, useMemo, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { useDesktop } from "./desktop-context";
import { indexOf, type FsNode } from "./fs";

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
function defaultPosition(path: string) {
  const step = Math.max(indexOf(path), 0) % 8;
  return { x: 96 + step * 32, y: 32 + step * 24 };
}

export function Window({
  node,
  width,
  zIndex,
  focused,
  constraints,
  children,
}: {
  node: FsNode;
  width: number;
  zIndex: number;
  focused: boolean;
  constraints: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const { close, focus } = useDesktop();
  const controls = useDragControls();
  const initial = useMemo(() => defaultPosition(node.path), [node.path]);
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
        "absolute top-0 left-0 flex flex-col bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]",
        // Phones: the front window fills the desktop and the others wait behind it.
        "max-sm:inset-0 max-sm:w-auto! max-sm:transform-none! max-sm:border-x-0 max-sm:border-b-0 max-sm:shadow-none",
        !focused && "max-sm:hidden",
      )}
      style={{ width, zIndex }}
    >
      <header
        onPointerDown={(event) => {
          if (matchMedia(DRAGGABLE).matches) controls.start(event);
        }}
        className={cn(
          "relative flex items-center justify-center border-b-2 border-black px-2 py-1 max-sm:py-2 sm:cursor-grab sm:active:cursor-grabbing touch-none select-none",
          focused &&
            "bg-[repeating-linear-gradient(to_bottom,black_0_1px,white_1px_3px)] bg-clip-content",
        )}
      >
        <button
          type="button"
          aria-label={`Close ${node.name}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={api.close}
          className="absolute left-2 w-3 h-3 max-sm:w-4 max-sm:h-4 border border-black bg-white hover:bg-gray-600 active:bg-black after:absolute after:-inset-3.5"
        />
        <h2 className="text-sm font-chicago bg-white px-2">{node.name}</h2>
      </header>
      <div className="p-4 max-h-[400px] overflow-auto max-sm:flex-1 max-sm:max-h-none max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]">
        <WindowContext value={api}>{children}</WindowContext>
      </div>
    </motion.section>
  );
}
