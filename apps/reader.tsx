"use client";

import { useState } from "react";
import { useDesktop } from "@/desktop/desktop-context";
import { shareUrl } from "@/desktop/fs";
import type { AppProps } from "@/desktop/registry";

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

/** Shows a document the server rendered (an MDX post) inside its window. */
export function Reader({ node }: AppProps) {
  const { content } = useDesktop();
  if (node.type !== "document") return null;
  const body = content[node.path];

  return (
    <article className="font-chicago text-sm">
      {body ?? <p aria-busy>Opening “{node.name}”…</p>}
      {body && (
        <footer className="mt-6 pt-3 border-t border-black flex items-center justify-between gap-3 text-xs">
          <time dateTime={node.date}>{longDate(node.date)}</time>
          <ShareButton url={shareUrl(node)} title={node.name} />
        </footer>
      )}
    </article>
  );
}
