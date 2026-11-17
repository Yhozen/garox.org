import type { MDXComponents } from "mdx/types";
import { DocLink } from "@/desktop/doc-link";

/** System 7 typography for every post. */
const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="text-lg font-bold mb-3" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-base font-bold mt-5 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="font-bold mt-4 mb-1" {...props}>
      {children}
    </h3>
  ),
  p: (props) => <p className="my-2 leading-relaxed" {...props} />,
  a: (props) => <DocLink className="underline hover:bg-black hover:text-white" {...props} />,
  ul: (props) => <ul className="my-2 pl-5 list-[square]" {...props} />,
  ol: (props) => <ol className="my-2 pl-5 list-decimal" {...props} />,
  li: (props) => <li className="my-0.5" {...props} />,
  blockquote: (props) => <blockquote className="my-3 border-l-4 border-black pl-3" {...props} />,
  hr: () => <hr className="my-4 border-t border-black" />,
  code: (props) => <code className="font-mono text-[0.9em]" {...props} />,
  pre: (props) => (
    <pre
      className="my-3 overflow-x-auto border border-black p-2 text-xs shadow-[2px_2px_0_#000]"
      {...props}
    />
  ),
  img: ({ alt = "", ...props }) => (
    // oxlint-disable-next-line nextjs/no-img-element -- post images are authored inline
    <img alt={alt} className="my-3 border border-black" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
