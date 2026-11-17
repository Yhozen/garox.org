/** One exhibit per room, drawn on a little desktop inside the frame. */
export type Exhibit =
  | { kind: "hover"; title: string; code: string; tooltip: string }
  | { kind: "terminal"; title: string; text: string }
  /** `queens[row]` is the column of that row's queen. */
  | { kind: "board"; title: string; queens: readonly number[] }
  | { kind: "pipeline"; title: string; steps: readonly string[] };

export type Room = {
  no: string;
  title: string;
  repo: string;
  dates: string;
  /** Day of November the project started, and how many days it ran (inclusive). */
  start: number;
  len: number;
  exhibit: Exhibit;
  caption: string;
  medium: string;
  dims: string;
  statement: string;
  facts: readonly string[];
  why: string;
};

/** The floor plan's ruler: November 9 to 16. */
export const PLAN = { first: 9, days: 8 } as const;

export const ROOMS: readonly Room[] = [
  {
    no: "01",
    title: "gpt2-in-types",
    repo: "https://github.com/Yhozen/gpt2-in-types",
    dates: "Nov 9 – 12, 2026",
    start: 9,
    len: 4,
    exhibit: {
      kind: "hover",
      title: "story.ts",
      code: 'type Story = Generate<"Once upon a time", 64>',
      tooltip: '"Once upon a time, there was a little girl named Lily. She had a big, red ball…"',
    },
    caption: "Hover the type. Wait about 30 seconds.",
    medium: "Integer language model, TypeScript type aliases",
    dims: "8 layers × 128 dimensions; 8 GB per hover",
    statement:
      "A GPT-2-style model where the tokenizer, attention, MLP and sampling are all types. The editor tooltip is the output device.",
    facts: [
      "Quantization-aware training, so the checker does exact integer math.",
      "Inspired by GPT-2 in CSS and TypeScript issue #14833.",
    ],
    why: "Because the type system is Turing complete, and nobody had made it tell a story.",
  },
  {
    no: "02",
    title: "tslua",
    repo: "https://github.com/Yhozen/tslua",
    dates: "Nov 11 – 13, 2026",
    start: 11,
    len: 3,
    exhibit: {
      kind: "terminal",
      title: "Terminal",
      text: "$ lua tsc.lua -b date-fns\n\nGo   47 s\nLua  ~28 min\n\nbyte-identical output",
    },
    caption: "Same compiler, same output, a few dozen times slower.",
    medium: "TypeScript compiler, ported from Go to Lua 5.4 by waves of AI agents",
    dims: "367,000 lines in 725 files; 265 commits in three days",
    statement:
      "The TypeScript 7 compiler, rewritten in a language small enough to run inside the type checker later.",
    facts: [
      "13,173 conformance configurations identical to Go.",
      "zod, rxjs, date-fns and TypeScript itself compile byte for byte the same.",
    ],
    why: "To get a TypeScript that a smaller language could carry.",
  },
  {
    no: "03",
    title: "lua-in-types",
    repo: "https://github.com/Yhozen/lua-in-types",
    dates: "Nov 13 – 14, 2026",
    start: 13,
    len: 2,
    exhibit: { kind: "board", title: "queens.lua", queens: [0, 4, 7, 5, 2, 6, 1, 3] },
    caption: "Eight queens, placed by the type checker.",
    medium: "Lua interpreter, then ahead-of-time compiler to type aliases",
    dims: "238 of 238 tests; 108 commits",
    statement:
      "Lua running inside TypeScript’s types: first interpreted, then compiled straight into aliases.",
    facts: [
      "Where I learned that heap cost grows with the heap.",
      "Its lessons shaped everything after it.",
    ],
    why: "Because if the checker can run a model, it can run a language.",
  },
  {
    no: "04",
    title: "ts-in-lua-in-types",
    repo: "https://github.com/Yhozen/ts-in-lua-in-types",
    dates: "Nov 13 – 14, 2026",
    start: 13,
    len: 2,
    exhibit: {
      kind: "hover",
      title: "main.ts",
      code: "const x: number = 'hello';",
      tooltip: "error TS2322: Type 'string' is not assignable to type 'number'.",
    },
    caption: "About 35 seconds and 9.5 GB for one red squiggle.",
    medium: "tslua compiled by lua-in-types",
    dims: "263 MB of emitted types; 409 of 656 checks",
    statement:
      "TypeScript, written in Lua, running inside TypeScript. It type checks TypeScript in a hover.",
    facts: [
      "The first time the real compiler ran inside the types.",
      "Its ceiling pointed to a cheaper route.",
    ],
    why: "Because the two previous pieces fit together.",
  },
  {
    no: "05",
    title: "go-in-types",
    repo: "https://github.com/Yhozen/go-in-types",
    dates: "Nov 14 – 16, 2026",
    start: 14,
    len: 3,
    exhibit: {
      kind: "pipeline",
      title: "Pipeline",
      steps: ["Go source", "go/ssa", "IR", "reference interpreter", ".d.ts"],
    },
    caption: "Go in, type aliases out.",
    medium: "Compiler from Go to TypeScript declarations",
    dims: "~108 instantiations per call (740 via Lua); 130 commits",
    statement:
      "A compiler that takes Go programs straight into the type system, skipping the Lua detour.",
    facts: [
      "A flat heap: a read costs 59 instantiations.",
      "Every program is checked against a reference interpreter first.",
    ],
    why: "Because TypeScript’s compiler is written in Go.",
  },
  {
    no: "06",
    title: "ts-in-types",
    repo: "https://github.com/Yhozen/ts-in-types",
    dates: "Nov 15 – 16, 2026",
    start: 15,
    len: 2,
    exhibit: {
      kind: "hover",
      title: "main.ts",
      code: '"hello".toUppercase()',
      tooltip:
        "error TS2551: Property 'toUppercase' does not exist on type '\"hello\"'. Did you mean 'toUpperCase'?",
    },
    caption: "About 1.5 seconds. It even suggests a fix.",
    medium: "TypeScript 7.0.2, compiled from Go into type aliases",
    dims: "36.7 MB of declarations; 652 of 656 checks",
    statement: "The real TypeScript 7 compiler running inside TypeScript’s type checker.",
    facts: [
      "A hover is about twenty times faster than the Lua route.",
      "The type checker now checks code with a copy of itself.",
    ],
    why: "Because by then, it was the obvious next step.",
  },
];
