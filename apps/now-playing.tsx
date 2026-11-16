"use client";

import { useCallback, useEffect, useState } from "react";
import type { NowPlaying as Track } from "@/lib/spotify";

const POLL_MS = 30_000;
/** Covers are dithered at this size, then scaled up with hard pixel edges. */
const COVER_PX = 96;

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; track: Track | null; fetchedAt: number };

/** Polls while the window is open and the tab is visible. */
function useNowPlaying() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/now-playing");
        if (!response.ok) throw new Error(String(response.status));
        const track = (await response.json()) as Track | null;
        if (!cancelled) setState({ status: "ready", track, fetchedAt: Date.now() });
      } catch {
        if (!cancelled) setState((prev) => (prev.status === "ready" ? prev : { status: "error" }));
      }
    };
    void load();
    const timer = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [refresh]);

  const reload = useCallback(() => setRefresh((n) => n + 1), []);
  return [state, reload] as const;
}

/** Ticks the playhead forward locally between polls. */
function useProgress(track: Track | null, fetchedAt: number, onEnd: () => void) {
  const [now, setNow] = useState(fetchedAt);
  const playing = track?.isPlaying ?? false;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [playing]);

  // When the song should be over, ask Spotify what came next.
  useEffect(() => {
    if (!track?.isPlaying) return;
    const remaining = track.durationMs - track.progressMs - (Date.now() - fetchedAt);
    const timer = setTimeout(onEnd, Math.max(remaining, 0) + 1000);
    return () => clearTimeout(timer);
  }, [track, fetchedAt, onEnd]);

  if (!track) return 0;
  const progress = track.progressMs + (playing ? Math.max(now - fetchedAt, 0) : 0);
  return Math.min(progress, track.durationMs);
}

/** Atkinson dithering, the error diffusion Bill Atkinson wrote for the original Mac. */
function dither(image: ImageData) {
  const { data, width, height } = image;
  const gray = new Float32Array(width * height);
  for (let i = 0; i < gray.length; i++) {
    const luma = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    // A little extra contrast keeps faces and type readable at 1 bit.
    gray[i] = (luma - 128) * 1.2 + 128;
  }
  const spread = [
    [1, 0],
    [2, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
  ];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const value = gray[i] < 128 ? 0 : 255;
      const error = (gray[i] - value) / 8;
      gray[i] = value;
      for (const [dx, dy] of spread) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny < height) gray[ny * width + nx] += error;
      }
    }
  }
  for (let i = 0; i < gray.length; i++) {
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = gray[i];
    data[i * 4 + 3] = 255;
  }
  return image;
}

/** Album art, dithered to 1 bit in an offscreen canvas. */
function Cover({ src, alt }: { src: string | null; alt: string }) {
  const [art, setArt] = useState<{ src: string; dithered: string } | null>(null);

  useEffect(() => {
    if (!src) return;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = COVER_PX;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      context.drawImage(image, 0, 0, COVER_PX, COVER_PX);
      context.putImageData(dither(context.getImageData(0, 0, COVER_PX, COVER_PX)), 0, 0);
      setArt({ src, dithered: canvas.toDataURL() });
    };
    image.src = src;
    return () => {
      image.onload = null;
    };
  }, [src]);

  const className =
    "block w-48 aspect-square border border-black [image-rendering:pixelated] max-sm:w-full";
  if (art?.src === src) {
    // A data URL drawn in the browser; there is nothing for next/image to optimize.
    // oxlint-disable-next-line nextjs/no-img-element
    return <img src={art.dithered} alt={alt} className={className} />;
  }
  // Until the art arrives, show the classic 50% gray desktop pattern.
  return (
    <div
      aria-hidden
      className={className}
      style={{ background: "repeating-conic-gradient(#000 0 25%, #fff 0 50%) 0 0 / 2px 2px" }}
    />
  );
}

const clock = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const ago = (iso: string) => {
  const minutes = Math.round((Date.parse(iso) - Date.now()) / 60_000);
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (minutes > -60) return format.format(minutes, "minute");
  if (minutes > -60 * 24) return format.format(Math.round(minutes / 60), "hour");
  return format.format(Math.round(minutes / 60 / 24), "day");
};

function Player({
  track,
  fetchedAt,
  onEnd,
}: {
  track: Track;
  fetchedAt: number;
  onEnd: () => void;
}) {
  const progress = useProgress(track, fetchedAt, onEnd);
  const status = track.isPlaying
    ? "♫ Now playing"
    : track.playedAt
      ? `Last played ${ago(track.playedAt)}`
      : "❚❚ Paused";

  return (
    <div className="flex flex-col items-center gap-3 text-sm font-chicago">
      <Cover src={track.cover} alt={`${track.album} cover art`} />
      <div className="w-full text-center">
        <p className="font-bold truncate">{track.track}</p>
        <p className="truncate">{track.artist}</p>
      </div>
      {!track.playedAt && (
        <div className="w-full">
          <progress
            aria-label="Playback position"
            max={track.durationMs}
            value={progress}
            className="block w-full h-3 appearance-none border border-black bg-white [&::-webkit-progress-bar]:bg-white [&::-webkit-progress-value]:bg-black [&::-moz-progress-bar]:bg-black"
          />
          <div className="flex justify-between text-xs tabular-nums mt-0.5">
            <span>{clock(progress)}</span>
            <span>{clock(track.durationMs)}</span>
          </div>
        </div>
      )}
      <p className="text-xs" aria-live="polite">
        {status}
      </p>
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md border border-black px-4 py-0.5 shadow-[0_0_0_1px_#fff,0_0_0_3px_#000] active:bg-black active:text-white max-sm:py-2"
      >
        Open in Spotify
      </a>
    </div>
  );
}

/** What Garox is listening to on Spotify right now. */
export function NowPlaying() {
  const [state, reload] = useNowPlaying();

  if (state.status === "loading") return <p className="text-sm font-chicago">Tuning in…</p>;
  if (state.status === "error")
    return <p className="text-sm font-chicago">The radio is out of range. Try again later.</p>;
  if (!state.track)
    return <p className="text-sm font-chicago">Ears resting. Nothing on Spotify right now.</p>;

  return <Player track={state.track} fetchedAt={state.fetchedAt} onEnd={reload} />;
}
