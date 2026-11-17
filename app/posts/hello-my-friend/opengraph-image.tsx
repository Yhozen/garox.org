import { postImage } from "@/lib/og";
import { metadata, published } from "./page.mdx";

export { contentType, size } from "@/lib/og";
export const alt = metadata.title;

export default function Image() {
  return postImage(metadata, published);
}
