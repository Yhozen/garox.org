import { entryImage } from "@/lib/og";
import { metadata, published } from "./page.mdx";

export { contentType, size } from "@/lib/og";
export const alt = metadata.title;

export default function Image() {
  return entryImage("Thoughts", metadata, published);
}
