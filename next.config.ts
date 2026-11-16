import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Posts are listed by reading content/posts at request time, so ship the
  // files with the server function.
  outputFileTracingIncludes: { "/": ["./content/posts/*.mdx"] },
  async redirects() {
    // Pretty links to share: land on the desktop with the post open in front
    // of the Posts folder.
    return [{ source: "/posts/:slug", destination: "/?w=posts,posts/:slug", permanent: false }];
  },
};

export default createMDX()(nextConfig);
