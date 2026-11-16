import fs from "node:fs";
import path from "node:path";
import type { PostMeta } from "@/desktop/fs";

type PostModule = {
  metadata: { title: string; description: string };
  /** `export const published = "2026-11-16"` in the post. */
  published: string;
};

const root = path.join(process.cwd(), "app/posts");

/**
 * Every post, newest first. A post is a folder with a page.mdx in
 * app/posts, so adding one is adding a file. Synchronous file reads and
 * module imports finish during prerendering, so this runs at build time.
 */
export async function getPosts(): Promise<PostMeta[]> {
  const slugs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "page.mdx")),
    )
    .map((entry) => entry.name);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = (await import(`@/app/posts/${slug}/page.mdx`)) as PostModule;
      return { slug, ...post.metadata, published: post.published };
    }),
  );
  return posts.toSorted((a, b) => b.published.localeCompare(a.published));
}
