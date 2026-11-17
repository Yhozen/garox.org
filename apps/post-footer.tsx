"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDesktop } from "@/desktop/desktop-context";
import { pathFromUrl, shareUrl, type FsNode } from "@/desktop/fs";

const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** Copies the post's link, or opens the share sheet where there is one (phones). */
function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const absolute = new URL(url, location.origin).toString();
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      await navigator.share({ title, url: absolute }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(absolute);
    } catch {
      // Clipboard blocked (permissions, insecure context): let them copy it by hand.
      window.prompt("Copy this link:", absolute);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-md border border-black px-3 py-0.5 shadow-[0_0_0_1px_#fff,0_0_0_3px_#000] active:bg-black active:text-white max-sm:py-2"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}

/** The date a post was published and a link to share it. */
export function PostFooter({ node }: { node: FsNode }) {
  if (node.type !== "document") return null;
  return (
    <footer className="mt-8 pt-3 border-t border-black flex items-center justify-between gap-3 text-xs">
      <time dateTime={node.published}>{longDate(node.published)}</time>
      <ShareButton url={shareUrl(node)} title={node.name} />
    </footer>
  );
}

/** The footer for the post page currently in the URL. */
export function CurrentPostFooter() {
  const { fs } = useDesktop();
  const node = fs.lookup(pathFromUrl(usePathname()));
  return node ? <PostFooter node={node} /> : null;
}
