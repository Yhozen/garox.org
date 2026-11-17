"use client";

import { useDesktop } from "@/desktop/desktop-context";
import { appFor } from "@/desktop/registry";

/** Renders a desktop node's app as a fullscreen page (`/now-playing`, `/thoughts`). */
export function FullscreenApp({ path }: { path: string }) {
  const { fs } = useDesktop();
  const node = fs.lookup(path);
  const app = node && appFor(node);
  if (!node || !app) return null;
  return <app.Component node={node} />;
}
