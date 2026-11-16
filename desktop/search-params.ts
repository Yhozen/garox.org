import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";
import { lookup, openWindows } from "./fs";

/** `?w=thoughts,thoughts/idea` — open window paths, back to front. */
export const windowsParam = {
  w: parseAsArrayOf(parseAsString, ",").withDefault([]),
};

export const loadDesktop = createLoader(windowsParam);

export const titleFor = (stack: string[]) => {
  const front = openWindows(stack).at(-1);
  return front ? `${lookup(front)!.name} — Garox.org` : "Garox.org";
};
