"use client";

import type { MDXContent } from "mdx/types";
import { Suspense, use } from "react";
import type { AppProps } from "@/desktop/registry";
import { PostFooter } from "./post-footer";

const modules = new Map<string, Promise<{ default: MDXContent }>>();

/** Each post's page module, loaded once: on hover, or when it first opens as a window. */
export function load(slug: string) {
  let loaded = modules.get(slug);
  if (!loaded) {
    loaded = import(`@/app/posts/${slug}/page.mdx`) as Promise<{ default: MDXContent }>;
    modules.set(slug, loaded);
  }
  return loaded;
}

function Body({ slug }: { slug: string }) {
  const { default: Post } = use(load(slug));
  return <Post />;
}

/**
 * A post in a window: how posts open from the desktop. Fullscreen (its own
 * URL) the page renders on the server; as a window, the same MDX module
 * loads here.
 */
export function Reader({ node }: AppProps) {
  if (node.type !== "document") return null;
  const slug = node.path.split("/").at(-1)!;

  return (
    <article className="font-chicago text-sm">
      <Suspense fallback={<p aria-busy>Opening “{node.name}”…</p>}>
        <Body slug={slug} />
      </Suspense>
      <PostFooter node={node} />
    </article>
  );
}
