import { createFileSystem, type FsNode } from "@/desktop/fs";
import { getLibrary } from "@/lib/library";

const walk = (node: FsNode): FsNode[] =>
  node.type === "folder" ? [node, ...node.children.flatMap(walk)] : [node];

/**
 * The desktop's file system, and every node the catch-all route gives a
 * page: folders, text files and apps. Posts and thoughts have their own
 * pages in app/posts and app/thoughts, and links leave the site.
 */
export async function desktopPages() {
  const fs = createFileSystem(await getLibrary());
  const all = [...fs.desktopItems, fs.aboutItem].flatMap(walk);
  return { fs, pages: all.filter((node) => node.type !== "link" && node.type !== "document") };
}
