"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { lookup, openWindows } from "./fs";
import { titleFor, windowsParam } from "./search-params";

type Desktop = {
  /** Open window paths, back to front. */
  stack: string[];
  open: (path: string) => void;
  close: (path: string) => void;
  focus: (path: string) => void;
};

const DesktopContext = createContext<Desktop | null>(null);

const toFront = (stack: string[], path: string) => [...stack.filter((p) => p !== path), path];

/**
 * The URL is the source of truth for which windows are open. Opening a
 * window pushes a history entry so Back closes it; focusing and closing
 * replace the current entry so history doesn't fill up.
 */
export function DesktopProvider({ children }: { children: ReactNode }) {
  const [{ w: rawStack }, setParams] = useQueryStates(windowsParam);
  const stack = useMemo(() => openWindows(rawStack), [rawStack]);

  useEffect(() => {
    document.title = titleFor(stack);
  }, [stack]);

  const open = useCallback(
    (path: string) => {
      const node = lookup(path);
      if (!node) return;
      if (node.type === "link") {
        window.open(node.url, "_blank", "noopener,noreferrer");
        return;
      }
      void setParams((prev) => ({ w: toFront(openWindows(prev.w), path) }), { history: "push" });
    },
    [setParams],
  );

  const close = useCallback(
    (path: string) => {
      void setParams((prev) => ({ w: openWindows(prev.w).filter((p) => p !== path) }));
    },
    [setParams],
  );

  const focus = useCallback(
    (path: string) => {
      if (stack.at(-1) === path) return;
      void setParams((prev) => ({ w: toFront(openWindows(prev.w), path) }));
    },
    [stack, setParams],
  );

  const value = useMemo(() => ({ stack, open, close, focus }), [stack, open, close, focus]);

  return <DesktopContext value={value}>{children}</DesktopContext>;
}

export function useDesktop(): Desktop {
  const desktop = useContext(DesktopContext);
  if (!desktop) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return desktop;
}
