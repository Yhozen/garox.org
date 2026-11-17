"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ModeProvider, useDesktop } from "./desktop-context";
import { pathFromUrl } from "./fs";
import { TitleBar } from "./window";
import { arrive } from "./zoom";

/**
 * Whatever the URL path points at, zoomed to fill the desktop and always on
 * top of the windows. The page itself (a post, or an app via the catch-all
 * route) is `children`, rendered on the server; this adds the window chrome.
 *
 * `children` always stays at this spot in the tree, even on the bare
 * desktop, so pages that Next keeps alive in the background (Activity)
 * keep their state and scroll position.
 */
export function Fullscreen({ children }: { children: ReactNode }) {
  const { fs, unzoom, closeFullscreen } = useDesktop();
  const path = pathFromUrl(usePathname());
  const node = path ? fs.lookup(path) : undefined;
  const frame = useRef<HTMLElement>(null);

  // If this was zoomed open, wait for the zoom rects to land before showing it.
  useLayoutEffect(() => {
    if (node && frame.current) arrive(node.path, frame.current);
  }, [node]);

  return (
    <section
      ref={frame}
      aria-label={node?.name}
      hidden={!path}
      className={cn(
        "absolute inset-0 z-[1000] flex flex-col",
        // An unknown path renders the not-found alert over the desktop instead.
        node && "bg-white border-t border-black max-sm:border-t-0",
      )}
    >
      {node && (
        <TitleBar
          title={node.name}
          active
          onClose={() => closeFullscreen(frame.current)}
          onZoom={() => frame.current && unzoom(frame.current)}
          zoomLabel={`Shrink ${node.name} into a window`}
        />
      )}
      <div className="relative min-h-0 flex-1">
        <ModeProvider value="fullscreen">{children}</ModeProvider>
      </div>
    </section>
  );
}
