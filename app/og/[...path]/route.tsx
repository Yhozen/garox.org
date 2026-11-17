import { card, desktopImage } from "@/lib/og";
import { desktopPages } from "@/lib/pages";

/**
 * Link previews for apps and folders (`/now-playing` → `/og/now-playing`).
 * A catch-all can't hold an `opengraph-image` file, so app/[...path]
 * points its metadata here instead.
 */
export async function generateStaticParams() {
  const { pages } = await desktopPages();
  return pages.map((node) => ({ path: node.path.split("/") }));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[...path]">) {
  const path = (await params).path.join("/");
  const node = (await desktopPages()).fs.lookup(path);
  if (!node) return new Response("Not found", { status: 404 });
  return desktopImage({
    title: node.name,
    children: card({ heading: node.name, text: `garox.org/${path}` }),
  });
}
