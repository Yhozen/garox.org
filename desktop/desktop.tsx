"use client";

import { useRef } from "react";
import { DesktopProvider, useDesktop } from "./desktop-context";
import { aboutItem, desktopItems, lookup } from "./fs";
import { NodeIcon } from "./icons";
import { MenuBar } from "./menu-bar";
import { appFor } from "./registry";
import { Window } from "./window";

function Windows({ constraints }: { constraints: React.RefObject<HTMLElement | null> }) {
  const { stack } = useDesktop();
  // Render in a stable order so focusing a window never moves its DOM node
  // (that would interrupt an in-progress drag); stacking comes from zIndex.
  const sorted = [...stack].sort();

  return sorted.map((path) => {
    const node = lookup(path)!;
    const app = appFor(node)!;
    const zIndex = stack.indexOf(path) + 1;
    return (
      <Window
        key={path}
        node={node}
        width={app.width}
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
  const { open } = useDesktop();
  const area = useRef<HTMLElement>(null);

  return (
    <div
      className="h-screen flex flex-col font-sans text-black overflow-hidden"
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
          {desktopItems.map((node) => (
            <NodeIcon key={node.path} node={node} onOpen={open} />
          ))}
        </div>
        <div className="absolute bottom-4 right-4">
          <NodeIcon node={aboutItem} onOpen={open} />
        </div>
        <Windows constraints={area} />
      </main>
    </div>
  );
}

export function RetroMac() {
  return (
    <DesktopProvider>
      <Screen />
    </DesktopProvider>
  );
}
