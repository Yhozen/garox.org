import type { ReactNode } from "react";
import { CurrentPostFooter } from "@/apps/post-footer";

/**
 * A Y Collection entry, fullscreen. Like a post's template (its own scroll
 * container, so Back returns to where you were), but without the reading
 * column: the gallery spans the window. The gutter is a variable so the
 * gallery's bands can pad themselves and run their rules edge to edge; in a
 * window it's unset and the window's own padding is the gutter.
 */
export default function YCollectionTemplate({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-auto [--y-gutter:1.5rem] max-sm:[--y-gutter:1.25rem]">
      {children}
      <div className="px-(--y-gutter) pb-8 font-chicago max-sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-[1120px]">
          <CurrentPostFooter />
        </div>
      </div>
    </div>
  );
}
