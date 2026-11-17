import type { CSSProperties, ReactNode } from "react";
import { FloorPlan } from "./floor-plan";
import { ROOMS, type Exhibit, type Room } from "./rooms";

/**
 * The Y Collection's README: a walk through a 1-bit museum, one room per
 * project. It renders inside a window (fullscreen or the Reader), so
 * everything sizes against the gallery's own width (container queries),
 * never the viewport, and nothing is fixed or uses ids.
 *
 * Plain components, so they render on the server fullscreen and in the
 * browser when the Reader loads this page as a window. Only the floor plan,
 * which scrolls, is a client component.
 */

/** The desktop's dots (desktop/desktop.tsx), on white. */
const DOTS: CSSProperties = {
  background:
    "radial-gradient(circle, #000 0.5px, transparent 0.5px) 0 0 / 8px 8px, radial-gradient(circle, #000 0.5px, transparent 0.5px) 4px 4px / 8px 8px, #fff",
};

/** 50% grey, 1-bit style. */
const DITHER: CSSProperties = {
  background: "repeating-conic-gradient(#000 0 25%, #fff 0 50%) 0 0 / 2px 2px",
};

/** Fullscreen pads with the template's gutter; a window pads its content itself. */
const BAND = "px-[var(--y-gutter,0px)]";
const COLUMN = "mx-auto max-w-[1120px]";
const KICKER = "text-xs font-bold uppercase leading-none tracking-[0.12em]";
const LEDE = "m-0 max-w-[600px] text-base leading-normal @[480px]/ygallery:text-lg";
const MONO = "font-[family-name:var(--font-geist-mono)]";

/**
 * A window's title bar as a picture: the same pinstripes and title as
 * TitleBar (desktop/window.tsx), with nothing to press or drag, and it
 * doesn't stop touch scrolling.
 */
function FauxTitleBar({ title }: { title: string }) {
  return (
    <div className="relative flex h-5 shrink-0 items-center justify-center border-b border-black">
      <span
        aria-hidden
        className="absolute inset-x-0.5 top-1/2 h-[10px] -translate-y-1/2 bg-[repeating-linear-gradient(to_bottom,#000_0_1px,transparent_1px_3px)]"
      />
      <span
        aria-hidden
        className="absolute left-2 size-[11px] border border-black bg-white shadow-[0_0_0_1px_#fff]"
      />
      <span className="relative bg-white px-1.5 text-[13px] leading-none font-bold">{title}</span>
    </div>
  );
}

function Hero() {
  return (
    <div className={BAND}>
      <div
        className={`${COLUMN} flex flex-col gap-5 pt-8 pb-6 @[600px]/ygallery:gap-7 @[600px]/ygallery:pt-[72px] @[600px]/ygallery:pb-10`}
      >
        <p className={`m-0 ${KICKER}`}>Permanent collection · November 2026</p>
        <h1 className="m-0 text-[clamp(36px,8cqi,88px)] leading-[0.95] font-bold tracking-[-0.01em]">
          Welcome to the Y&nbsp;Collection.
        </h1>
        <p className={LEDE}>
          A handful of projects made for you to go <b>“But why??”</b>
        </p>
        <p className={LEDE}>
          The name sounds like Y Combinator. It really comes from how my friends reacted when I
          showed them what I was building.
        </p>
        <p className={LEDE}>
          It started when I realized TypeScript’s type system is Turing complete, so a language
          model could live inside it. Each piece after that was built on what the previous one
          taught me.
        </p>
        <p className="m-0 mt-2 flex items-center gap-2 text-[13px] font-bold">
          Scroll to begin <span aria-hidden>↓</span>
        </p>
      </div>
    </div>
  );
}

/** An 11 × 11 pixel queen, drawn as one path of 1px runs. */
const QUEEN = [
  "...........",
  ".#...#...#.",
  ".#..###..#.",
  ".##.###.##.",
  ".#########.",
  "..#######..",
  "...#####...",
  "...#####...",
  "..#######..",
  ".#########.",
  ".#########.",
]
  .flatMap((row, y) =>
    [...row.matchAll(/#+/g)].map(
      (run) => `M${run.index} ${y}h${run[0].length}v1h-${run[0].length}z`,
    ),
  )
  .join("");

function Board({ queens }: { queens: readonly number[] }) {
  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a grid of squares, not an image file
      role="img"
      aria-label="An 8 by 8 chessboard with eight queens, none attacking another"
      className="grid grid-cols-8 border-2 border-black bg-white"
    >
      {queens.flatMap((queen, row) =>
        queens.map((_, col) => {
          const dark = (row + col) % 2 === 1;
          const here = queen === col;
          return (
            <div
              key={`${row}-${col}`}
              className={`flex size-6 items-center justify-center @[360px]/ygallery:size-8 ${here && dark ? "outline outline-1 -outline-offset-1 outline-black" : ""}`}
              style={dark && !here ? DITHER : undefined}
            >
              {here && (
                <svg viewBox="0 0 11 11" shapeRendering="crispEdges" className="size-[22px]">
                  <path d={QUEEN} />
                </svg>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

function Screen({ exhibit }: { exhibit: Exhibit }) {
  switch (exhibit.kind) {
    case "hover":
      return (
        <div className={`flex min-w-0 max-w-full flex-col ${MONO}`}>
          <code
            className={`self-start border border-black bg-white px-3.5 py-2.5 text-xs wrap-anywhere @[600px]/ygallery:text-sm`}
          >
            {exhibit.code}
          </code>
          <div className="mt-2 ml-4 max-w-[440px] border border-black bg-white px-3.5 py-3 text-[13px] leading-[1.55] whitespace-pre-wrap wrap-anywhere shadow-[2px_2px_0_#000] @[600px]/ygallery:ml-10">
            {exhibit.tooltip}
          </div>
        </div>
      );
    case "terminal":
      return (
        <pre
          className={`m-0 w-full max-w-[440px] border border-black bg-black px-[18px] py-4 text-sm leading-[1.6] whitespace-pre-wrap text-white wrap-anywhere ${MONO}`}
        >
          {exhibit.text}
        </pre>
      );
    case "board":
      return <Board queens={exhibit.queens} />;
    case "pipeline":
      return (
        <ol className="m-0 flex list-none flex-wrap items-center justify-center gap-2.5 p-0">
          {exhibit.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-2.5">
              <span className="border border-black bg-white px-3 py-2.5 text-[13px] font-bold shadow-[2px_2px_0_#000]">
                {step}
              </span>
              {i < exhibit.steps.length - 1 && <span aria-hidden>→</span>}
            </li>
          ))}
        </ol>
      );
  }
}

/** The art: a little window on a desktop, in a white mat that casts the shadow. */
function Frame({ exhibit, caption }: { exhibit: Exhibit; caption: string }) {
  return (
    <figure className="y-frame m-0 border border-black bg-white p-3 shadow-[4px_4px_0_#000] @[600px]/ygallery:p-7 @[600px]/ygallery:shadow-[6px_6px_0_#000]">
      <div className="border border-black">
        <FauxTitleBar title={exhibit.title} />
        <div
          className="flex min-h-[220px] items-center justify-center p-4 @[600px]/ygallery:min-h-[300px] @[600px]/ygallery:p-7"
          style={DOTS}
        >
          <Screen exhibit={exhibit} />
        </div>
      </div>
      <figcaption className="mt-3.5 text-center text-xs leading-[1.4]">{caption}</figcaption>
    </figure>
  );
}

/** The museum label beside the art. It sits flat on the wall: no shadow. */
function WallLabel({ room }: { room: Room }) {
  return (
    <div className="y-label flex flex-col gap-3.5 border border-black bg-white px-6 py-[22px]">
      <h2 className="m-0 text-xl leading-[1.1] font-bold @[480px]/ygallery:text-2xl">
        {room.title}
      </h2>
      <div className="flex flex-col gap-1 text-[13px] leading-normal">
        <p className="m-0">
          <b>Garox</b> · {room.dates}
        </p>
        <p className="m-0 italic">{room.medium}</p>
        <p className="m-0">Dimensions: {room.dims}</p>
      </div>
      <div aria-hidden className="h-px bg-black" />
      <p className="m-0 text-[15px] leading-[1.55]">{room.statement}</p>
      <ul className="m-0 flex list-[square] flex-col gap-1.5 pl-[18px] text-[13px] leading-normal">
        {room.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
      <div className="flex flex-col gap-1 border border-black px-3 py-2.5">
        <p className="m-0 text-[11px] leading-none font-bold tracking-[0.1em] uppercase">
          Why would you do that?
        </p>
        <p className="m-0 text-sm leading-[1.45]">{room.why}</p>
      </div>
      <a
        href={room.repo}
        target="_blank"
        rel="noreferrer"
        aria-label={`View source of ${room.title} on GitHub`}
        className="self-start text-[13px] font-bold underline hover:bg-black hover:text-white"
      >
        View source <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function RoomSection({ room }: { room: Room }) {
  return (
    <section
      data-room={room.no}
      tabIndex={-1}
      aria-label={`Room ${room.no}, ${room.title}`}
      className={`${BAND} border-t border-black py-12 outline-none @[600px]/ygallery:py-24`}
    >
      <div className={`${COLUMN} flex flex-col gap-6 @[600px]/ygallery:gap-10`}>
        <div className="flex flex-wrap items-baseline gap-4 text-xs">
          <span className={KICKER}>
            Room {room.no} of {String(ROOMS.length).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="h-1.5 min-w-10 flex-1 border-y border-black"
            style={DITHER}
          />
          <span>{room.dates}</span>
        </div>
        <div className="grid items-center gap-6 @[820px]/ygallery:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] @[820px]/ygallery:gap-14">
          <Frame exhibit={room.exhibit} caption={room.caption} />
          <WallLabel room={room} />
        </div>
      </div>
    </section>
  );
}

function Exit() {
  return (
    <section
      className={`${BAND} flex flex-col items-center gap-4 border-t border-black py-16 text-center @[600px]/ygallery:pt-[120px] @[600px]/ygallery:pb-[160px]`}
    >
      <p className={`m-0 ${KICKER}`}>Exit</p>
      <p className="m-0 max-w-[720px] text-[clamp(26px,4.5cqi,44px)] leading-[1.1] font-bold">
        None of these projects are useful. That’s the point.
      </p>
      <p className="m-0 text-base">If you asked “why?”, the piece worked.</p>
    </section>
  );
}

function Plan({ children }: { children: ReactNode }) {
  return (
    <div className={`${BAND} pb-12 @[600px]/ygallery:pb-24`}>
      <div className={`${COLUMN} mt-5 border border-black bg-white shadow-[4px_4px_0_#000]`}>
        <FauxTitleBar title="Floor plan · Nov 9 to 16" />
        {children}
      </div>
    </div>
  );
}

export function YGallery() {
  return (
    <div
      data-ygallery
      className="@container/ygallery bg-white font-chicago text-[15px] leading-[1.55] text-black"
    >
      <Hero />
      <nav aria-label="Floor plan">
        <Plan>
          <FloorPlan />
        </Plan>
      </nav>
      {ROOMS.map((room) => (
        <RoomSection key={room.no} room={room} />
      ))}
      <Exit />
    </div>
  );
}
