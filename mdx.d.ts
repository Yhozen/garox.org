/** Posts are MDX files with these exports (see app/posts). */
declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";

  export const metadata: { title: string; description: string };
  /** The publish date, as `"YYYY-MM-DD"`. */
  export const published: string;
  const Content: MDXContent;
  export default Content;
}
