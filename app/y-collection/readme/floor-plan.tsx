"use client";

import { PLAN, ROOMS } from "./rooms";

/**
 * Scrolls the window this gallery is in to a room. The page can be mounted
 * twice (the fullscreen copy stays alive behind a window), so rooms are
 * found inside this copy rather than by id, and only its own scroller
 * moves: `scrollIntoView` would also scroll the desktop.
 */
function jump(from: HTMLElement, no: string) {
  const room = from.closest("[data-ygallery]")?.querySelector<HTMLElement>(`[data-room="${no}"]`);
  let scroller = room?.parentElement;
  while (scroller && !/auto|scroll/.test(getComputedStyle(scroller).overflowY))
    scroller = scroller.parentElement;
  if (!room || !scroller) return;
  // Just past the room's top rule, which would otherwise double the title bar's.
  const top =
    scroller.scrollTop +
    room.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    1;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scroller.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  // So the next Tab continues from the room, not the floor plan.
  room.focus({ preventScroll: true });
}

const percent = (days: number) => `${(days / PLAN.days) * 100}%`;
const days = Array.from({ length: PLAN.days }, (_, i) => PLAN.first + i);

/**
 * A Gantt chart of the six projects, one row per room; each row jumps to
 * its room. Labels sit beside the bars when there's room, above them when not.
 */
export function FloorPlan() {
  return (
    <div className="flex flex-col gap-2 p-3 @[600px]/ygallery:px-6 @[600px]/ygallery:py-5">
      <div
        aria-hidden
        className="@[820px]/ygallery:grid @[820px]/ygallery:grid-cols-[180px_minmax(0,1fr)] @[820px]/ygallery:gap-4"
      >
        <div className="hidden @[820px]/ygallery:block" />
        <div className="grid grid-cols-8 border-b border-black">
          {days.map((day) => (
            <span key={day} className="border-l border-black pb-1 pl-1 text-[11px] font-bold">
              {day}
            </span>
          ))}
        </div>
      </div>
      {ROOMS.map((room) => (
        <button
          key={room.no}
          type="button"
          onClick={(event) => jump(event.currentTarget, room.no)}
          className="group flex min-h-11 flex-col justify-center gap-1 text-left font-bold transition-transform duration-150 ease-[cubic-bezier(.23,1,.32,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-safe:active:scale-[0.99] @[820px]/ygallery:grid @[820px]/ygallery:min-h-7 @[820px]/ygallery:grid-cols-[180px_minmax(0,1fr)] @[820px]/ygallery:items-center @[820px]/ygallery:gap-4 @[820px]/ygallery:pointer-coarse:min-h-11"
        >
          <span className="w-fit text-xs group-hover:bg-black group-hover:text-white group-focus-visible:bg-black group-focus-visible:text-white">
            <span className="sr-only">Go to room </span>
            {room.no} {room.title}
          </span>
          <span className="relative h-[18px] w-full">
            <span
              aria-hidden
              className="absolute inset-y-0 flex items-center overflow-hidden border border-black bg-black text-white group-hover:outline-2 group-hover:-outline-offset-4 group-hover:outline-white group-focus-visible:outline-2 group-focus-visible:-outline-offset-4 group-focus-visible:outline-white"
              style={{ left: percent(room.start - PLAN.first), width: percent(room.len) }}
            >
              <span className="truncate px-1.5 text-[11px] leading-4">{room.title}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
