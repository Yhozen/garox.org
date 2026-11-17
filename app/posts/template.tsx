import type { ReactNode } from "react";
import { CurrentPostFooter } from "@/apps/post-footer";

/**
 * A post, fullscreen: a readable column with its date and a share button.
 * A template rather than a layout, so each post gets its own scroll
 * container — new posts open at the top, and Back (which keeps the previous
 * page alive) returns to where you were reading.
 */
export default function PostTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-auto">
      <article className="mx-auto max-w-[40rem] px-6 py-8 font-chicago text-[15px] max-sm:px-5 max-sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
        {children}
        <CurrentPostFooter />
      </article>
    </div>
  );
}
