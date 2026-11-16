"use client";

import { useDesktop } from "@/desktop/desktop-context";
import { NodeIcon } from "@/desktop/icons";
import type { AppProps } from "@/desktop/registry";

export function Finder({ node }: AppProps) {
  const { open } = useDesktop();
  if (node.type !== "folder") return null;

  return (
    <>
      {/* Finder's info bar, set off from the icons by a double rule. */}
      <div className="-mx-4 -mt-4 mb-3 border-b-[3px] border-double border-black px-2 py-0.5 text-xs font-chicago">
        {node.children.length} {node.children.length === 1 ? "item" : "items"}
      </div>
      <div className="flex flex-wrap gap-x-4">
        {node.children.map((child) => (
          <NodeIcon key={child.path} node={child} onOpen={open} />
        ))}
      </div>
    </>
  );
}
