import fs from "node:fs";
import path from "node:path";
import type { Collection, Entry, Library } from "@/desktop/fs";
import { COLLECTIONS } from "@/desktop/fs";

type EntryModule = {
  metadata: { title: string; description: string };
  /** `export const published = "2026-11-16"` in the entry. */
  published: string;
};

/**
 * Every entry in app/<collection> (posts, thoughts), newest first. An entry
 * is a folder with a page.mdx, so adding one is adding a file. Synchronous
 * file reads and module imports finish during prerendering, so this runs at
 * build time.
 */
async function getEntries(collection: Collection): Promise<Entry[]> {
  const root = path.join(process.cwd(), "app", collection);
  const slugs = fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "page.mdx")),
    )
    .map((entry) => entry.name);

  // Every entry shares with its own preview card; see app/posts/hello-my-friend.
  for (const slug of slugs) {
    if (!fs.existsSync(path.join(root, slug, "opengraph-image.tsx"))) {
      throw new Error(
        `app/${collection}/${slug} needs an opengraph-image.tsx for its link preview`,
      );
    }
  }

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const entry = (await import(`@/app/${collection}/${slug}/page.mdx`)) as EntryModule;
      return { slug, ...entry.metadata, published: entry.published };
    }),
  );
  return entries.toSorted((a, b) => b.published.localeCompare(a.published));
}

/** Posts and thoughts, for the desktop to list. */
export async function getLibrary(): Promise<Library> {
  const [posts, thoughts] = await Promise.all(COLLECTIONS.map(getEntries));
  return { posts, thoughts };
}
