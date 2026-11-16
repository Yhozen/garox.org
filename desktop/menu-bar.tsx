"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useDesktop } from "./desktop-context";

type MenuItem = { label: string; action?: () => void };

export function MenuBar() {
  const { stack, close } = useDesktop();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const front = stack.at(-1);

  useEffect(() => {
    if (!activeMenu) return;
    const dismiss = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setActiveMenu(null);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setActiveMenu(null);
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [activeMenu]);

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: "New Folder" },
      { label: "Open" },
      { label: "Print" },
      { label: "Close Window", action: front ? () => close(front) : undefined },
    ],
    Edit: ["Undo", "Cut", "Copy", "Paste", "Clear", "Select All"].map((label) => ({ label })),
    View: ["by Small Icon", "by Icon", "by Name", "by Date", "by Size", "by Kind"].map((label) => ({
      label,
    })),
    Label: [
      "None",
      "Essential",
      "Hot",
      "In Progress",
      "Cool",
      "Personal",
      "Project 1",
      "Project 2",
    ].map((label) => ({ label })),
    Special: ["Clean Up Window", "Empty Trash", "Erase Disk", "Restart", "Shut Down"].map(
      (label) => ({ label }),
    ),
  };

  return (
    <nav
      ref={ref}
      className="bg-white border-b-2 border-black px-2 pb-1 pt-[max(0.25rem,env(safe-area-inset-top))] max-sm:pb-2 max-sm:pt-[max(0.5rem,env(safe-area-inset-top))] flex items-center space-x-4 text-sm font-chicago relative z-50"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M1 1h14v14H1V1zm1 1v12h12V2H2zm2 2h8v8H4V4zm1 1v6h6V5H5z" fill="black" />
      </svg>
      {Object.entries(menus).map(([menu, items]) => (
        // Only File does anything yet, so phones skip the decorative menus.
        <div key={menu} className={cn("relative", menu !== "File" && "max-sm:hidden")}>
          <button
            type="button"
            aria-expanded={activeMenu === menu}
            className={`focus:outline-hidden ${activeMenu === menu ? "bg-black text-white" : ""}`}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
          >
            {menu}
          </button>
          {activeMenu === menu && (
            <div className="absolute left-0 top-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] min-w-[140px]">
              {items.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  className="block w-full text-left px-4 py-1 max-sm:py-3 hover:bg-black hover:text-white"
                  onClick={() => {
                    item.action?.();
                    setActiveMenu(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
