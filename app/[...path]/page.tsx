import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { FullscreenApp } from "@/apps/fullscreen-app";
import { cn } from "@/lib/utils";
import { desktopPages } from "@/lib/pages";

/**
 * Every folder, text file and app on the desktop has a URL (`/thoughts`,
 * `/thoughts/idea`, `/now-playing`) which shows it fullscreen.
 */
const nodes = desktopPages;

export async function generateStaticParams() {
  const { pages } = await nodes();
  return pages.map((node) => ({ path: node.path.split("/") }));
}

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { fs } = await nodes();
  const node = fs.lookup((await params).path.join("/"));
  if (!node) return {};
  // A catch-all can't hold an opengraph-image file, so its previews come from /og.
  const image = { url: `/og/${node.path}`, width: 1200, height: 630, alt: node.name };
  return { title: node.name, openGraph: { siteName: "Garox.org", images: [image] } };
}

export default async function Page({ params }: PageProps<"/[...path]">) {
  const path = (await params).path.join("/");
  const { fs } = await nodes();
  const node = fs.lookup(path);
  if (!node) notFound();
  // An alias's URL is its original's.
  if (node.type === "alias") redirect(`/${node.target}`);

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
