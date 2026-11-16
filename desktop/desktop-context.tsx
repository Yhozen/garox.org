"use client";

import { useQueryStates } from "nuqs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { createFileSystem, type FileSystem, type PostMeta } from "./fs";
import { windowsParam } from "./search-params";

/** Window contents rendered on the server, keyed by window path. */
export type ServerContent = Record<string, ReactNode>;

type Desktop = {
  fs: FileSystem;
  /** Open window paths, back to front. */
  stack: string[];
  content: ServerContent;
  /** True while the server renders a window that was just opened. */
  pending: boolean;
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
 *
 * Most windows render in the browser, so those updates stay shallow. A
 * document (an MDX post) renders on the server: opening one makes a
 * non-shallow update, Next re-renders the page for the new URL, and the
 * post arrives in `content`.
 */
export function DesktopProvider({
  posts,
  content,
  children,
}: {
  posts: PostMeta[];
  content: ServerContent;
  children: ReactNode;
}) {
  const fs = useMemo(() => createFileSystem(posts), [posts]);
  const [{ w: rawStack }, setParams] = useQueryStates(windowsParam);
  const stack = useMemo(() => fs.openWindows(rawStack), [fs, rawStack]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    document.title = fs.titleFor(stack);
  }, [fs, stack]);

  const open = useCallback(
    (path: string) => {
      const node = fs.lookup(path);
      if (!node) return;
      if (node.type === "link") {
        window.open(node.url, "_blank", "noopener,noreferrer");
        return;
      }
      // Only ask the server when it hasn't already rendered this window.
      const shallow = node.type !== "document" || path in content;
      void setParams((prev) => ({ w: toFront(fs.openWindows(prev.w), path) }), {
        history: "push",
        shallow,
        startTransition: shallow ? undefined : startTransition,
      });
    },
    [fs, content, setParams],
  );

  const close = useCallback(
    (path: string) => {
      void setParams((prev) => ({ w: fs.openWindows(prev.w).filter((p) => p !== path) }));
    },
    [fs, setParams],
  );

  const focus = useCallback(
    (path: string) => {
      if (stack.at(-1) === path) return;
      void setParams((prev) => ({ w: toFront(fs.openWindows(prev.w), path) }));
    },
    [fs, stack, setParams],
  );

  const value = useMemo(
    () => ({ fs, stack, content, pending, open, close, focus }),
    [fs, stack, content, pending, open, close, focus],
  );

  return <DesktopContext value={value}>{children}</DesktopContext>;
}

export function useDesktop(): Desktop {
  const desktop = useContext(DesktopContext);
  if (!desktop) throw new Error("useDesktop must be used inside <DesktopProvider>");
  return desktop;
}
