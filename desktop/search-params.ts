import { createLoader, parseAsArrayOf, parseAsString } from "nuqs/server";

/** `?w=thoughts,thoughts/idea` — open window paths, back to front. */
export const windowsParam = {
  w: parseAsArrayOf(parseAsString, ",").withDefault([]),
};

export const loadDesktop = createLoader(windowsParam);
