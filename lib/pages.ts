import { createFileSystem, type FsNode } from "@/desktop/fs";
import { getLibrary } from "@/lib/library";

const walk = (node: FsNode): FsNode[] =>
  node.type === "folder" ? [node, ...node.children.flatMap(walk)] : [node];

/**
 * The desktop's file system, and every node the catch-all route gives a
 * page: folders, text files and apps. Posts, thoughts and other
 * collections have their own pages in app/<collection>, links leave the
 * site, and an alias's URL is its target's.
 */
export async function desktopPages() {
  const fs = createFileSystem(await getLibrary());
  const all = [...fs.desktopItems, fs.aboutItem].flatMap(walk);
  return {
    fs,
    pages: all.filter(
      (node) => node.type === "folder" || node.type === "text" || node.type === "app",
    ),
  };
}
