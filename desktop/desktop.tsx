"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { DesktopProvider, useDesktop, type ServerContent } from "./desktop-context";
import type { PostMeta } from "./fs";
import { NodeIcon } from "./icons";
import { MenuBar } from "./menu-bar";
import { appFor } from "./registry";
import { Window } from "./window";

function Windows({ constraints }: { constraints: React.RefObject<HTMLElement | null> }) {
  const { fs, stack } = useDesktop();
  // Render in a stable order so focusing a window never moves its DOM node
  // (that would interrupt an in-progress drag); stacking comes from zIndex.
  const sorted = [...stack].sort();

  return sorted.map((path) => {
    const node = fs.lookup(path)!;
    const app = appFor(node)!;
    const zIndex = stack.indexOf(path) + 1;
    return (
      <Window
        key={path}
        node={node}
        width={app.width}
        height={app.height}
        zIndex={zIndex}
        focused={zIndex === stack.length}
        constraints={constraints}
      >
        <app.Component node={node} />
      </Window>
    );
  });
}

function Screen() {
  const { fs, open, pending } = useDesktop();
  const area = useRef<HTMLElement>(null);

  return (
    <div
      className={cn(
        "h-dvh flex flex-col font-sans text-black overflow-hidden touch-manipulation",
        // The server is rendering a window that was just opened.
        pending && "cursor-wait",
      )}
      style={{
        background: `
        radial-gradient(circle, #000 0.5px, transparent 0.5px) 0 0 / 8px 8px,
        radial-gradient(circle, #000 0.5px, transparent 0.5px) 4px 4px / 8px 8px
      `,
        backgroundColor: "#CECECE",
      }}
    >
      <MenuBar />
      <main ref={area} className="relative flex-1">
        <div className="p-4 flex flex-wrap content-start gap-x-2">
          {fs.desktopItems.map((node) => (
            <NodeIcon key={node.path} node={node} onOpen={open} />
          ))}
        </div>
        <div className="absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]">
          <NodeIcon node={fs.aboutItem} onOpen={open} />
        </div>
        <Windows constraints={area} />
      </main>
    </div>
  );
}

export function RetroMac({ posts, content }: { posts: PostMeta[]; content: ServerContent }) {
  return (
    <DesktopProvider posts={posts} content={content}>
      <Screen />
    </DesktopProvider>
  );
}
