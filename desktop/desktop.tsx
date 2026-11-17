"use client";

import { usePathname } from "next/navigation";
import { useQueryStates } from "nuqs";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { DesktopProvider, useDesktop } from "./desktop-context";
import { pathFromUrl, type Library } from "./fs";
import { Fullscreen } from "./fullscreen";
import { NodeIcon } from "./icons";
import { MenuBar } from "./menu-bar";
import { appFor } from "./registry";
import { windowsParam } from "./search-params";
import { Window } from "./window";

/**
 * The windows from `?w`. This is the only part of the desktop that reads
 * the query string, so it renders in the browser (inside Suspense) while
 * everything else, including the fullscreen page, is prerendered.
 */
function Windows({ constraints }: { constraints: RefObject<HTMLElement | null> }) {
  const { fs, connect } = useDesktop();
  const [{ w }, setWindows] = useQueryStates(windowsParam);
  const fullscreen = pathFromUrl(usePathname());
  // Whatever is fullscreen sits on top, so it isn't also a window.
  const stack = useMemo(
    () => fs.openWindows(w).filter((path) => path !== fullscreen),
    [fs, w, fullscreen],
  );

  useLayoutEffect(() => connect(setWindows), [connect, setWindows]);

  // Fullscreen pages get their title from their metadata; the bare desktop
  // is titled after its front window.
  useEffect(() => {
    if (!fullscreen) document.title = fs.titleFor(stack);
  }, [fs, stack, fullscreen]);

  // Render in a stable order so focusing a window never moves its DOM node
  // (that would interrupt an in-progress drag); stacking comes from zIndex.
  return [...stack].sort().map((path) => {
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

function Screen({ children }: { children: ReactNode }) {
  const { fs, area, pending } = useDesktop();

  return (
    <div
      className={cn(
        "h-dvh flex flex-col font-sans text-black overflow-hidden touch-manipulation",
        // System 7's watch cursor while a fullscreen page loads.
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
      <main ref={area} className="relative flex-1 isolate">
        <div className="p-4 flex flex-wrap content-start gap-x-2">
          {fs.desktopItems.map((node) => (
            <NodeIcon key={node.path} node={node} />
          ))}
        </div>
        <div className="absolute right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]">
          <NodeIcon node={fs.aboutItem} />
        </div>
        <Suspense fallback={null}>
          <Windows constraints={area} />
        </Suspense>
        <Fullscreen>{children}</Fullscreen>
      </main>
    </div>
  );
}

/** The whole desktop. Lives in the root layout, so it persists across pages. */
export function Desktop({ library, children }: { library: Library; children: ReactNode }) {
  return (
    <DesktopProvider library={library}>
      <Screen>{children}</Screen>
    </DesktopProvider>
  );
}
