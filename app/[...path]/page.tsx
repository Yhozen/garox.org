import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FullscreenApp } from "@/apps/fullscreen-app";
import { createFileSystem, type FsNode } from "@/desktop/fs";
import { cn } from "@/lib/utils";
import { getPosts } from "@/lib/posts";

/**
 * Every folder, text file and app on the desktop has a URL — `/thoughts`,
 * `/thoughts/idea`, `/now-playing` — which shows it fullscreen. Posts have
 * their own pages in app/posts; links leave the site.
 */
const walk = (node: FsNode): FsNode[] =>
  node.type === "folder" ? [node, ...node.children.flatMap(walk)] : [node];

async function nodes() {
  const fs = createFileSystem(await getPosts());
  const all = [...fs.desktopItems, fs.aboutItem].flatMap(walk);
  return { fs, pages: all.filter((node) => node.type !== "link" && node.type !== "document") };
}

export async function generateStaticParams() {
  const { pages } = await nodes();
  return pages.map((node) => ({ path: node.path.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { fs } = await nodes();
  const node = fs.lookup((await params).path.join("/"));
  return node ? { title: node.name } : {};
}

export default async function Page({ params }: PageProps<"/[...path]">) {
  const path = (await params).path.join("/");
  const { fs } = await nodes();
  const node = fs.lookup(path);
  if (!node) notFound();

  return (
    <div className="h-full overflow-auto">
      <div
        className={cn(
          "p-4 max-sm:pb-[max(1rem,env(safe-area-inset-bottom))]",
          // A folder spreads out like a maximized Finder window; anything else reads in a column.
          node.type !== "folder" && "mx-auto max-w-[40rem]",
        )}
      >
        <FullscreenApp path={path} />
      </div>
    </div>
  );
}
