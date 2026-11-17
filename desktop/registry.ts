import type { ComponentType } from "react";
import { About } from "@/apps/about";
import { Finder } from "@/apps/finder";
import { NowPlaying } from "@/apps/now-playing";
import { Reader } from "@/apps/reader";
import { SimpleText } from "@/apps/simpletext";
import type { FsNode } from "./fs";

/**
 * An app renders the contents of a window. It only receives serializable
 * props and talks to the shell through `useWindow()`/`useDesktop()`, so it
 * could later be served from elsewhere (e.g. a microfrontend in an iframe).
 */
export type AppProps = { node: FsNode };

export type AppDefinition = {
  Component: ComponentType<AppProps>;
  /** Default window width in pixels on larger screens. */
  width: number;
  /** Maximum content height in pixels on larger screens (default 400). */
  height?: number;
};

export const apps = {
  finder: { Component: Finder, width: 320 },
  simpletext: { Component: SimpleText, width: 360 },
  about: { Component: About, width: 340 },
  nowplaying: { Component: NowPlaying, width: 260 },
  reader: { Component: Reader, width: 480, height: 520 },
} satisfies Record<string, AppDefinition>;

export type AppId = keyof typeof apps;

/** Which app opens a node; links leave the site and aliases open their target instead. */
export function appFor(node: FsNode): AppDefinition | null {
  switch (node.type) {
    case "folder":
      return apps.finder;
    case "text":
      return apps.simpletext;
    case "app":
      return apps[node.app];
    case "document":
      return apps.reader;
    case "link":
    case "alias":
      return null;
  }
}
