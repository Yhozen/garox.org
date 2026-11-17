import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import { RUNE } from "./rune";

/**
 * Link previews are a still of the desktop: the dotted background, the menu
 * bar with the rune where the Apple used to be, and one System 7 window
 * showing what the link opens. Drawn at twice the site's scale, so 1px lines
 * on the site are 2px here.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINE = 2;

export function Rune({ size, color = "#000" }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {RUNE.map(({ end }) => (
        <line
          key={`l${end.x}`}
          x1="50"
          y1="50"
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
      {RUNE.map(({ dot }) => (
        <circle key={`d${dot.x}`} cx={dot.x} cy={dot.y} r="7.5" fill={color} />
      ))}
    </svg>
  );
}

/** The desktop's dotted pattern: a dot every 8px, offset on every other row. */
function Dots() {
  return (
    <svg width={size.width} height={size.height} style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="2" height="2" fill="#000" />
          <rect x="8" y="8" width="2" height="2" fill="#000" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function MenuBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        height: 44,
        padding: "0 28px",
        background: "#fff",
        borderBottom: `${LINE}px solid #000`,
        fontSize: 24,
      }}
    >
      <Rune size={26} />
      {["File", "Edit", "View", "Label", "Special"].map((menu) => (
        <span key={menu}>{menu}</span>
      ))}
    </div>
  );
}

/** A close or zoom box: white, outlined, with a white ring that cuts the stripes. */
function Box({ zoom }: { zoom?: boolean }) {
  return (
    <div style={{ display: "flex", padding: LINE, background: "#fff" }}>
      <div
        style={{
          display: "flex",
          width: 22,
          height: 22,
          border: `${LINE}px solid #000`,
          background: "#fff",
        }}
      >
        {zoom && (
          <div
            style={{
              width: 12,
              height: 12,
              borderRight: `${LINE}px solid #000`,
              borderBottom: `${LINE}px solid #000`,
            }}
          />
        )}
      </div>
    </div>
  );
}

function TitleBar({ title }: { title: string }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        borderBottom: `${LINE}px solid #000`,
      }}
    >
      {/* Four pinstripes, inset from the frame. */}
      <div
        style={{
          position: "absolute",
          left: 4,
          right: 4,
          top: 9,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ height: LINE, background: "#000" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 14, top: 6, display: "flex" }}>
        <Box />
      </div>
      <div style={{ position: "absolute", right: 14, top: 6, display: "flex" }}>
        <Box zoom />
      </div>
      <div style={{ display: "flex", padding: "0 12px", background: "#fff", fontSize: 24 }}>
        {title}
      </div>
    </div>
  );
}

/** The desktop with one window titled `title`, holding `children`. */
export function desktopImage({ title, children }: { title: string; children: ReactNode }) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundColor: "#CECECE",
        color: "#000",
      }}
    >
      <Dots />
      <MenuBar />
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 940,
            height: 440,
            marginBottom: 12,
            background: "#fff",
            border: `${LINE}px solid #000`,
            boxShadow: "8px 8px 0 #000",
          }}
        >
          <TitleBar title={title} />
          <div style={{ display: "flex", flex: 1, padding: "40px 48px" }}>{children}</div>
        </div>
      </div>
    </div>,
    size,
  );
}

/** The usual window body: a heading, a line of text, and the site at the bottom. */
export function card({ heading, text, note }: { heading: string; text?: string; note?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", fontSize: 68, lineHeight: 1.1, letterSpacing: -1 }}>
        {heading}
      </div>
      {text && (
        <div
          style={{ display: "flex", marginTop: 20, fontSize: 32, lineHeight: 1.35, color: "#333" }}
        >
          {text}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          fontSize: 26,
        }}
      >
        <span>{note ?? ""}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Rune size={34} />
          <span>garox.org</span>
        </div>
      </div>
    </div>
  );
}

/** A post's preview: its title and description in a window, dated. */
export function postImage(
  { title, description }: { title: string; description: string },
  published: string,
) {
  const date = new Date(`${published}T12:00:00Z`).toLocaleDateString("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  });
  return desktopImage({
    title: "Posts",
    children: card({ heading: title, text: description, note: date }),
  });
}
