import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { RetroMac } from "@/desktop/desktop";
import { loadDesktop, titleFor } from "@/desktop/search-params";

type Props = { searchParams: Promise<SearchParams> };

// Reading the search params renders shared links with their windows already
// open, and gives each link the title of its front window.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { w } = await loadDesktop(searchParams);
  return { title: { absolute: titleFor(w) } };
}

export default async function Home({ searchParams }: Props) {
  await searchParams;
  return <RetroMac />;
}
