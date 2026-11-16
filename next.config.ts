import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Posts are listed by reading content/posts at request time, so ship the
  // files with the server function.
  outputFileTracingIncludes: {
    "/": ["./content/posts/*.mdx"],
    "/posts/[slug]": ["./content/posts/*.mdx"],
  },
};

export default createMDX()(nextConfig);
