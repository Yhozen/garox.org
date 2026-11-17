import { createFileSystem, type FsNode } from "@/desktop/fs";
import { getPosts } from "@/lib/posts";

const walk = (node: FsNode): FsNode[] =>
  node.type === "folder" ? [node, ...node.children.flatMap(walk)] : [node];

/**
 * The desktop's file system, and every node the catch-all route gives a
 * page: folders, text files and apps. Posts have their own pages in
 * app/posts, and links leave the site.
 */
export async function desktopPages() {
  const fs = createFileSystem(await getPosts());
  const all = [...fs.desktopItems, fs.aboutItem].flatMap(walk);
  return { fs, pages: all.filter((node) => node.type !== "link" && node.type !== "document") };
}
