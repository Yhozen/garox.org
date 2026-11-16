"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { lookup } from "./fs";
import { appFor } from "./registry";

type Desktop = {
  /** Open window paths, back to front. */
  stack: string[];
  open: (path: string) => void;
  close: (path: string) => void;
  focus: (path: string) => void;
};

const DesktopContext = createContext<Desktop | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [rawStack, setStack] = useState<string[]>([]);

  // Ignore anything that no longer resolves to an openable node.
  const stack = useMemo(
    () =>
      rawStack.filter((path, i) => {
        const node = lookup(path);
        return node && appFor(node) && rawStack.indexOf(path) === i;
      }),
    [rawStack],
  );

  const open = useCallback((path: string) => {
    const node = lookup(path);
    if (!node) return;
    if (node.type === "link") {
      window.open(node.url, "_blank", "noopener,noreferrer");
      return;
    }
    setStack((prev) => [...prev.filter((p) => p !== path), path]);
  }, []);

  const close = useCallback((path: string) => {
    setStack((prev) => prev.filter((p) => p !== path));
  }, []);

  const focus = useCallback(
    (path: string) => {
      if (stack.at(-1) === path) return;
      setStack((prev) => [...prev.filter((p) => p !== path), path]);
    },
    [stack],
  );

  const value = useMemo(() => ({ stack, open, close, focus }), [stack, open, close, focus]);

  return <DesktopContext value={value}>{children}</DesktopContext>;
}

export function useDesktop(): Desktop {
  const desktop = useContext(DesktopContext);
  if (!desktop) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return desktop;
}
