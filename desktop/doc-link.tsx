"use client";

import Link from "next/link";
import { useRef, type ComponentProps } from "react";
import { useDesktop, useMode } from "./desktop-context";
import { pathFromUrl } from "./fs";

/** The node a same-site href points at: `/posts/x`, `/now-playing`, or `/?w=…,x`. */
function nodeFor(href: string): string | null {
  if (!href.startsWith("/")) return null;
  const url = new URL(href, "https://garox.org");
  if (url.pathname !== "/") return pathFromUrl(url.pathname);
  return url.searchParams.get("w")?.split(",").at(-1) ?? null;
}

/**
 * Links inside posts and apps. A link to something on the desktop opens it
 * in kind — fullscreen from a fullscreen page, as a window from a window —
 * and keeps the other windows. It stays a real link, so Cmd-click, new tabs
 * and crawlers still work, and Next prefetches it.
 */
export function DocLink({ href = "", children, ...props }: ComponentProps<"a">) {
  const { fs, open } = useDesktop();
  const mode = useMode();
  const anchor = useRef<HTMLAnchorElement>(null);
  const path = nodeFor(href);

  if (!path || !fs.lookup(path)) {
    const external = !href.startsWith("/") && !href.startsWith("#");
    return (
      <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={anchor}
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        open(path, { from: anchor.current, mode });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
