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
      className="absolute top-0 left-0 bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]"
      style={{ width, zIndex }}
    >
      <header
        onPointerDown={(event) => controls.start(event)}
        className={cn(
          "relative flex items-center justify-center border-b-2 border-black px-2 py-1 cursor-grab active:cursor-grabbing touch-none select-none",
          focused &&
            "bg-[repeating-linear-gradient(to_bottom,black_0_1px,white_1px_3px)] bg-clip-content",
        )}
      >
        <button
          type="button"
          aria-label={`Close ${node.name}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={api.close}
          className="absolute left-2 w-3 h-3 border border-black bg-white hover:bg-gray-600 active:bg-black"
        />
        <h2 className="text-sm font-chicago bg-white px-2">{node.name}</h2>
      </header>
      <div className="p-4 max-h-[400px] overflow-auto">
        <WindowContext value={api}>{children}</WindowContext>
      </div>
    </motion.section>
  );
}
