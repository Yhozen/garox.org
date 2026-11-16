import type { AppProps } from "@/desktop/registry";

export function SimpleText({ node }: AppProps) {
  if (node.type !== "text") return null;
  return <div className="font-chicago text-sm whitespace-pre-wrap">{node.content}</div>;
}
