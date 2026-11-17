import type { AppId } from "./registry";

/**
 * Folders whose files are MDX: app/<collection>/<slug>/page.mdx exports
 * `metadata` (title, description) and `published`. Posts are longer pieces,
 * thoughts are short ones.
 */
export const COLLECTIONS = ["posts", "thoughts", "y-collection", "game-museum"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export type Entry = { slug: string; title: string; description: string; published: string };
export type Library = Record<Collection, Entry[]>;

type Kind =
  | { type: "folder"; children: FsNode[] }
  | { type: "text"; content: string }
  | { type: "link"; url: string }
  | { type: "app"; app: AppId }
  /** A System 7 alias: an icon here that opens the node at `target`. */
  | { type: "alias"; target: string }
  /** A post or thought. Its page is app/<path>/page.mdx. */
  | { type: "document"; published: string; description: string };

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

const alias =
  (slug: string, name: string, target: string): Make =>
  (parent) => ({ type: "alias", name, path: join(parent, slug), target });

const document =
  ({ slug, title, published, description }: Entry): Make =>
  (parent) => ({ type: "document", name: title, path: join(parent, slug), published, description });

/**
 * Builds the desktop. Every node's path is also its URL (`/posts/hello-my-friend`,
 * `/now-playing`). Collections come from their app/<collection> folders,
 * so the server lists them and hands the same lists to the client to build
 * an identical tree.
 */
export function createFileSystem(library: Library) {
  const collection = (slug: Collection, name: string) =>
    folder(slug, name, library[slug].map(document));
  const desktopItems: FsNode[] = [
    folder("system-folder", "System Folder", [
      text("system", "System", "System information goes here."),
      text("finder", "Finder", "Finder details go here."),
      folder("control-panels", "Control Panels", []),
    ]),
    folder("projects", "Projects", [
      link("reccupera", "Reccupera", "https://reccupera.cl"),
      link("copte", "Copte", "https://copte.cl"),
      alias("y-collection", "Y Collection", "y-collection"),
      alias("game-museum", "Game museum", "game-museum"),
    ]),
    collection("thoughts", "Thoughts"),
    collection("posts", "Posts"),
    collection("y-collection", "Y Collection"),
    collection("game-museum", "Game museum"),
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

  /** Keeps paths that open a window (links leave the site, aliases open their target), without duplicates. */
  const openWindows = (paths: string[]): string[] =>
    paths.filter((path, i) => {
      const node = index.get(path);
      return node && node.type !== "link" && node.type !== "alias" && paths.indexOf(path) === i;
    });

  return {
    desktopItems,
    aboutItem,
    lookup,
    openWindows,
    indexOf: (path: string): number => order.indexOf(path),
    titleFor: (stack: string[]): string => {
      const front = openWindows(stack).at(-1);
      return front ? `${lookup(front)!.name} · Garox.org` : "Garox.org";
    },
  };
}

export type FileSystem = ReturnType<typeof createFileSystem>;

/** Every node opens fullscreen at its own path, so that is the link to share. */
export const shareUrl = (node: FsNode): string => `/${node.path}`;

/** The node path a URL pathname shows fullscreen ("" for the bare desktop). */
export const pathFromUrl = (pathname: string): string => decodeURIComponent(pathname.slice(1));
