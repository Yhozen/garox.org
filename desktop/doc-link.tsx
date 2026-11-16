"use client";

import type { ComponentProps, MouseEvent } from "react";
import { useDesktop } from "./desktop-context";

/** The window a same-site href points at: `/posts/x` or `/?w=…,x`. */
function windowFor(href: string): string | null {
  if (!href.startsWith("/")) return null;
  const url = new URL(href, "https://garox.org");
  if (url.pathname.startsWith("/posts/")) return url.pathname.slice(1);
  return url.searchParams.get("w")?.split(",").at(-1) ?? null;
}

/**
 * Links inside documents. Links to other windows open them on the desktop;
 * the href stays a real URL, so crawlers, new tabs and copied links still work.
 */
export function DocLink({ href = "", children, ...props }: ComponentProps<"a">) {
  const { fs, open } = useDesktop();
  const path = windowFor(href);

  if (!path || !fs.lookup(path)) {
    const external = !href.startsWith("/") && !href.startsWith("#");
    return (
      <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} {...props}>
        {children}
      </a>
    );
  }

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    open(path);
  };
  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
}
