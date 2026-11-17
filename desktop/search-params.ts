import { createLoader, createSerializer, parseAsArrayOf, parseAsString } from "nuqs";

/**
 * `?w=thoughts,thoughts/idea` — the windows open on the desktop, back to
 * front. The URL path is separate: it's whatever is open fullscreen on top.
 */
export const windowsParam = {
  w: parseAsArrayOf(parseAsString, ",").withDefault([]),
};

/** Reads `?w` from a search string, for event handlers. */
export const loadWindows = createLoader(windowsParam);

/** Builds a URL from a path and the desktop's windows: `/posts/x?w=a,b`. */
export const desktopUrl = createSerializer(windowsParam);
