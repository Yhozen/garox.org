import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { RetroMac } from "@/desktop/desktop";
import { createFileSystem, shareUrl } from "@/desktop/fs";
import { loadDesktop } from "@/desktop/search-params";
import { getPosts, renderPost } from "@/lib/posts";

type Props = { searchParams: Promise<SearchParams> };

async function load(searchParams: Promise<SearchParams>) {
  const [{ w }, posts] = await Promise.all([loadDesktop(searchParams), getPosts()]);
  const fs = createFileSystem(posts);
  return { posts, fs, stack: fs.openWindows(w) };
}

// Reading the search params renders shared links with their windows already
// open, and gives each link the title (and, for posts, the description) of
// its front window.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { fs, stack } = await load(searchParams);
  const title = fs.titleFor(stack);
  const front = fs.lookup(stack.at(-1) ?? "");
  if (front?.type !== "document") return { title: { absolute: title } };

  return {
    title: { absolute: title },
    description: front.description,
    // Shares with other windows open count as the same page as the post itself.
    alternates: { canonical: `/?w=${front.path}` },
    openGraph: {
      type: "article",
      title: front.name,
      description: front.description,
      publishedTime: front.date,
      url: shareUrl(front),
    },
  };
}

export default async function Home({ searchParams }: Props) {
  const { posts, fs, stack } = await load(searchParams);
  // Render every open document here, so it arrives as HTML in its window.
  const documents = stack.filter((path) => fs.lookup(path)?.type === "document");
  const content = Object.fromEntries(
    await Promise.all(
      documents.map(async (path) => [path, await renderPost(path.split("/").at(-1)!)] as const),
    ),
  );
  return <RetroMac posts={posts} content={content} />;
}
