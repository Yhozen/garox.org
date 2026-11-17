import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages are a static shell plus streamed parts, and pages you leave stay
  // alive in the background (Activity), keeping their state and scroll.
  cacheComponents: true,
  partialPrefetching: true,
  // Posts are app/posts/<slug>/page.mdx.
  pageExtensions: ["ts", "tsx", "mdx"],
  // Posts are listed by reading app/posts. That happens at build time, but
  // crawlers get pages rendered on request, so ship the files too.
  outputFileTracingIncludes: { "/**": ["./app/posts/*/page.mdx"] },
};

export default createMDX()(nextConfig);
