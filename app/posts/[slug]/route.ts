import { notFound } from "next/navigation";
import { getPosts } from "@/lib/posts";

/**
 * Pretty links to share: /posts/<slug> lands on the desktop with the post
 * open in front of the Posts folder. A handler (rather than a config redirect)
 * keeps the target readable — `?w=posts,posts/<slug>`, not `%2C`/`%2F`.
 */
export async function GET(request: Request, { params }: RouteContext<"/posts/[slug]">) {
  const { slug } = await params;
  const posts = await getPosts();
  if (!posts.some((post) => post.slug === slug)) notFound();
  return Response.redirect(new URL(`/?w=posts,posts/${slug}`, request.url), 307);
}
