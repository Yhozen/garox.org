import { card, desktopImage } from "@/lib/og";

export { contentType, size } from "@/lib/og";
export const alt = "Garox.org, Gabriel Pérez's personal page";

export default function Image() {
  return desktopImage({
    title: "Garox.org",
    children: card({
      heading: "Garox's personal page",
      text: "Posts, things I'm building, and what I'm listening to.",
      note: "Gabriel Pérez · New York",
    }),
  });
}
