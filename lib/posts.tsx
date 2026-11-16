import type { MDXContent } from "mdx/types";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { PostMeta } from "@/desktop/fs";

type PostModule = { default: MDXContent; metadata: Omit<PostMeta, "slug"> };

/** Each post is a file: content/posts/<slug>.mdx, opened as the window posts/<slug>. */
const load = (slug: string) => import(`@/content/posts/${slug}.mdx`) as Promise<PostModule>;

/** Every post, newest first, from the files in content/posts. */
export const getPosts = cache(async (): Promise<PostMeta[]> => {
  const files = await readdir(path.join(process.cwd(), "content/posts"));
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.slice(0, -".mdx".length);
        const { metadata } = await load(slug);
        return { slug, ...metadata };
      }),
  );
  return posts.toSorted((a, b) => b.date.localeCompare(a.date));
});

/** Renders a post on the server; only called for slugs that getPosts found. */
export async function renderPost(slug: string) {
  const { default: Post } = await load(slug);
  return <Post />;
}
