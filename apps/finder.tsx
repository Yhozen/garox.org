"use client";

import { useDesktop } from "@/desktop/desktop-context";
import { NodeIcon } from "@/desktop/icons";
import type { AppProps } from "@/desktop/registry";

export function Finder({ node }: AppProps) {
  const { open } = useDesktop();
  if (node.type !== "folder") return null;

  return (
    <>
      <div className="text-xs mb-2 font-chicago">{node.children.length} items</div>
      <div className="flex flex-wrap gap-x-4">
        {node.children.map((child) => (
          <NodeIcon key={child.path} node={child} onOpen={open} />
        ))}
      </div>
    </>
  );
}
