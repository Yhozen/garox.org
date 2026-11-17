"use client";

import type { MDXContent } from "mdx/types";
import { Suspense, use } from "react";
import type { AppProps } from "@/desktop/registry";
import { PostFooter } from "./post-footer";

const modules = new Map<string, Promise<{ default: MDXContent }>>();

/**
 * Each post's or thought's page module (`posts/x`, `thoughts/y`), loaded
 * once: on hover, or when it first opens as a window.
 */
export function load(path: string) {
  let loaded = modules.get(path);
  if (!loaded) {
    loaded = import(`@/app/${path}/page.mdx`) as Promise<{ default: MDXContent }>;
    modules.set(path, loaded);
  }
  return loaded;
}

function Body({ path }: { path: string }) {
  const { default: Post } = use(load(path));
  return <Post />;
}

/**
 * A post or thought in a window: how they open from the desktop. Fullscreen (its own
 * URL) the page renders on the server; as a window, the same MDX module
 * loads here.
 */
export function Reader({ node }: AppProps) {
  if (node.type !== "document") return null;
  return (
    <article className="font-chicago text-sm">
      <Suspense fallback={<p aria-busy>Opening “{node.name}”…</p>}>
        <Body path={node.path} />
      </Suspense>
      <PostFooter node={node} />
    </article>
  );
}
