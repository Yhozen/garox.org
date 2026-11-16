import type { ReactNode } from "react";

const specs: [string, ReactNode][] = [
  ["Age", "28"],
  ["Location", "New York, NY"],
  [
    "Work",
    <>
      Software Engineer @{" "}
      <a
        href="https://archlending.com"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:bg-black hover:text-white"
      >
        Arch Lending
      </a>
    </>,
  ],
];

export function About() {
  return (
    <div className="font-chicago text-sm space-y-3">
      <p className="font-bold">Garox&apos;s Macintosh IIfx</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3">
        {specs.map(([term, value]) => (
          <div key={term} className="contents">
            <dt>{term}:</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p>System Software 7.0.1</p>
    </div>
  );
}
