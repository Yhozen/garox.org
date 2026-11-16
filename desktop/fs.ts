import type { AppId } from "./registry";

/** What a post's MDX file exports as `metadata`, plus its file name. */
export type PostMeta = { slug: string; title: string; date: string; description: string };

type Kind =
  | { type: "folder"; children: FsNode[] }
  | { type: "text"; content: string }
  | { type: "link"; url: string }
  | { type: "app"; app: AppId }
  /** Rendered on the server (an MDX post) and streamed into its window. */
  | { type: "document"; date: string; description: string };

/** Anything that can appear as an icon. `path` doubles as the window id. */
export type FsNode = { name: string; path: string } & Kind;

type Make = (parent: string) => FsNode;

const join = (parent: string, slug: string) => (parent ? `${parent}/${slug}` : slug);

const folder =
  (slug: string, name: string, children: Make[]): Make =>
  (parent) => {
    const path = join(parent, slug);
    return { type: "folder", name, path, children: children.map((child) => child(path)) };
  };

const text =
  (slug: string, name: string, content: string): Make =>
  (parent) => ({ type: "text", name, path: join(parent, slug), content });

const link =
  (slug: string, name: string, url: string): Make =>
  (parent) => ({ type: "link", name, path: join(parent, slug), url });

const app =
  (slug: string, name: string, id: AppId): Make =>
  (parent) => ({ type: "app", name, path: join(parent, slug), app: id });

const document =
  ({ slug, title, date, description }: PostMeta): Make =>
  (parent) => ({ type: "document", name: title, path: join(parent, slug), date, description });

/**
 * Builds the desktop. Posts come from `content/posts/*.mdx`, so the server
 * reads them and hands the same list to the client to build an identical tree.
 */
export function createFileSystem(posts: PostMeta[]) {
  const desktopItems: FsNode[] = [
    folder("system-folder", "System Folder", [
      text("system", "System", "System information goes here."),
      text("finder", "Finder", "Finder details go here."),
      folder("control-panels", "Control Panels", []),
    ]),
    folder("projects", "Projects", [
      link("project-a", "Project A", "https://example.com/project-a"),
      link("project-b", "Project B", "https://example.com/project-b"),
      link("project-c", "Project C", "https://example.com/project-c"),
    ]),
    folder("thoughts", "Thoughts", [
      text("idea", "idea.txt", "My brilliant idea: a retro-styled portfolio!"),
      text("notes", "notes.txt", "Remember to add more retro elements."),
    ]),
    folder("posts", "Posts", posts.map(document)),
    app("now-playing", "Now Playing", "nowplaying"),
  ].map((make) => make(""));

  /** The About This Mac icon, pinned to the bottom-right corner. */
  const aboutItem: FsNode = app("about", "About This Mac", "about")("");

  const index = new Map<string, FsNode>();
  const visit = (node: FsNode) => {
    index.set(node.path, node);
    if (node.type === "folder") node.children.forEach(visit);
  };
  [...desktopItems, aboutItem].forEach(visit);

  /** Every node in depth-first order, used to stagger default window positions. */
  const order = [...index.keys()];

  const lookup = (path: string): FsNode | undefined => index.get(path);

  /** Keeps paths that open a window (links leave the site), without duplicates. */
  const openWindows = (paths: string[]): string[] =>
    paths.filter((path, i) => {
      const node = index.get(path);
      return node && node.type !== "link" && paths.indexOf(path) === i;
    });

  return {
    desktopItems,
    aboutItem,
    lookup,
    openWindows,
    indexOf: (path: string): number => order.indexOf(path),
    titleFor: (stack: string[]): string => {
      const front = openWindows(stack).at(-1);
      return front ? `${lookup(front)!.name} — Garox.org` : "Garox.org";
    },
  };
}

export type FileSystem = ReturnType<typeof createFileSystem>;

/** The link to share for a window: posts get a pretty URL, the rest a desktop URL. */
export const shareUrl = (node: FsNode): string =>
  node.type === "document" && node.path.startsWith("posts/") ? `/${node.path}` : `/?w=${node.path}`;
