const specs = [
  ["Age", "26"],
  ["Location", "Santiago, Chile"],
  ["Work", "CTO @ Reccupera"],
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
