import type { FsNode } from "./fs";
import type { AppId } from "./registry";

const frame = "w-10 h-10";

function FolderIcon() {
  return (
    <svg className={frame} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M5 10h30v25H5z" fill="white" stroke="black" strokeWidth="2" />
      <path d="M10 5h20v5H10z" fill="white" stroke="black" strokeWidth="2" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className={frame} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="5" y="5" width="30" height="30" fill="white" stroke="black" strokeWidth="2" />
      <path d="M15 20h10M20 15l5 5-5 5" stroke="black" strokeWidth="2" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg className={frame} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="5" y="5" width="30" height="30" fill="white" stroke="black" strokeWidth="2" />
      <path d="M10 10h20v5H10zM10 20h20M10 25h20M10 30h10" stroke="black" strokeWidth="2" />
    </svg>
  );
}

function MacIcon() {
  return (
    <svg className={frame} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="4" y="8" width="32" height="24" fill="white" stroke="black" strokeWidth="2" />
      <rect x="8" y="12" width="24" height="16" fill="white" stroke="black" strokeWidth="2" />
    </svg>
  );
}

function RadioIcon() {
  return (
    <svg className={frame} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M12 10l16-5" stroke="black" strokeWidth="2" />
      <rect x="4" y="10" width="32" height="22" fill="white" stroke="black" strokeWidth="2" />
      <circle cx="12" cy="23" r="5" stroke="black" strokeWidth="2" />
      <circle cx="28" cy="23" r="5" stroke="black" strokeWidth="2" />
      <path d="M17 15h6" stroke="black" strokeWidth="2" />
    </svg>
  );
}

const icons = { folder: FolderIcon, link: LinkIcon, text: TextIcon, app: MacIcon };
const appIcons: Partial<Record<AppId, () => React.JSX.Element>> = { nowplaying: RadioIcon };

/** A labelled icon that opens its node when clicked. */
export function NodeIcon({ node, onOpen }: { node: FsNode; onOpen: (path: string) => void }) {
  const Glyph = (node.type === "app" && appIcons[node.app]) || icons[node.type];
  return (
    <button
      type="button"
      onClick={() => onOpen(node.path)}
      className="flex flex-col items-center w-16 mb-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-black"
    >
      <Glyph />
      <span className="text-xs mt-1 font-chicago text-center">{node.name}</span>
    </button>
  );
}
