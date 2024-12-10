"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

// Types
interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder" | "link";
  content?: string;
  children?: FileSystemItem[];
  url?: string;
}

interface Window {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  zIndex: number;
}

// File System Data
const fileSystemData: FileSystemItem[] = [
  {
    id: "system-folder",
    name: "System Folder",
    type: "folder",
    children: [
      {
        id: "system",
        name: "System",
        type: "file",
        content: "System information goes here.",
      },
      {
        id: "finder",
        name: "Finder",
        type: "file",
        content: "Finder details go here.",
      },
      {
        id: "control-panels",
        name: "Control Panels",
        type: "folder",
        children: [],
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    children: [
      {
        id: "project-a",
        name: "Project A",
        type: "link",
        url: "https://example.com/project-a",
      },
      {
        id: "project-b",
        name: "Project B",
        type: "link",
        url: "https://example.com/project-b",
      },
      {
        id: "project-c",
        name: "Project C",
        type: "link",
        url: "https://example.com/project-c",
      },
    ],
  },
  {
    id: "thoughts",
    name: "Thoughts",
    type: "folder",
    children: [
      {
        id: "idea",
        name: "idea.txt",
        type: "file",
        content: "My brilliant idea: a retro-styled portfolio!",
      },
      {
        id: "notes",
        name: "notes.txt",
        type: "file",
        content: "Remember to add more retro elements.",
      },
    ],
  },
  {
    id: "posts",
    name: "Posts",
    type: "folder",
    children: [
      {
        id: "post1",
        name: "post1.txt",
        type: "file",
        content: "My first blog post content.",
      },
      {
        id: "post2",
        name: "post2.txt",
        type: "file",
        content: "My second blog post content.",
      },
      {
        id: "post3",
        name: "post3.txt",
        type: "file",
        content: "My third blog post content.",
      },
    ],
  },
];

// Components
const MenuBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = {
    File: ["New Folder", "Open", "Print", "Close Window"],
    Edit: ["Undo", "Cut", "Copy", "Paste", "Clear", "Select All"],
    View: [
      "by Small Icon",
      "by Icon",
      "by Name",
      "by Date",
      "by Size",
      "by Kind",
    ],
    Label: [
      "None",
      "Essential",
      "Hot",
      "In Progress",
      "Cool",
      "Personal",
      "Project 1",
      "Project 2",
    ],
    Special: [
      "Clean Up Window",
      "Empty Trash",
      "Erase Disk",
      "Restart",
      "Shut Down",
    ],
  };

  return (
    <div className="bg-white border-b-2 border-black px-2 py-1 flex items-center space-x-4 text-sm font-chicago relative z-50">
      <svg
        className="w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1h14v14H1V1zm1 1v12h12V2H2zm2 2h8v8H4V4zm1 1v6h6V5H5z"
          fill="black"
        />
      </svg>
      {Object.entries(menus).map(([menu, items]) => (
        <div key={menu} className="relative">
          <button
            className={`focus:outline-none ${activeMenu === menu ? "bg-black text-white" : ""}`}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
          >
            {menu}
          </button>
          {activeMenu === menu && (
            <div className="absolute left-0 top-full mt-1 bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] min-w-[140px]">
              {items.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left px-4 py-1 hover:bg-black hover:text-white"
                  onClick={() => setActiveMenu(null)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Icon = ({
  name,
  svg,
  onClick,
}: {
  name: string;
  svg: React.ReactNode;
  onClick?: () => void;
}) => (
  <div
    className="flex flex-col items-center w-16 mb-4 cursor-pointer"
    onClick={onClick}
  >
    {svg}
    <span className="text-xs mt-1 font-chicago text-center">{name}</span>
  </div>
);

const MacWindow = ({
  title,
  children,
  position,
  zIndex,
  onClose,
  onFocus,
  onDragEnd,
}: {
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onDragEnd: (position: { x: number; y: number }) => void;
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={position}
      onDragEnd={(_, info) => {
        onDragEnd({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      className="bg-white border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] absolute"
      style={{ width: "280px", zIndex }}
      onMouseDown={onFocus}
    >
      <div className="bg-white border-b-2 border-black px-2 py-1 flex justify-between items-center">
        <button
          onClick={onClose}
          className="w-3 h-3 border border-black bg-white hover:bg-gray-600 active:bg-black"
        />
        <span className="text-sm font-chicago">{title}</span>
        <div />
      </div>
      <div className="p-4 max-h-[400px] overflow-auto">{children}</div>
    </motion.div>
  );
};

const Desktop = ({
  fileSystem,
  openWindow,
}: {
  fileSystem: FileSystemItem[];
  openWindow: (item: FileSystemItem) => void;
}) => {
  return (
    <div className="p-4 flex flex-wrap content-start">
      {fileSystem.map((item) => (
        <Icon
          key={item.id}
          name={item.name}
          onClick={() => openWindow(item)}
          svg={
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {item.type === "folder" ? (
                <>
                  <path
                    d="M5 10h30v25H5z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 5h20v5H10z"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                </>
              ) : item.type === "link" ? (
                <>
                  <rect
                    x="5"
                    y="5"
                    width="30"
                    height="30"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 20h10M20 15l5 5-5 5"
                    stroke="black"
                    strokeWidth="2"
                  />
                </>
              ) : (
                <>
                  <rect
                    x="5"
                    y="5"
                    width="30"
                    height="30"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 10h20v5H10zM10 20h20M10 25h20M10 30h10"
                    stroke="black"
                    strokeWidth="2"
                  />
                </>
              )}
            </svg>
          }
        />
      ))}
    </div>
  );
};

const WindowContent = ({
  item,
  openWindow,
}: {
  item: FileSystemItem;
  openWindow: (item: FileSystemItem) => void;
}) => {
  if (item.type === "folder") {
    return (
      <>
        <div className="text-xs mb-2 font-chicago">
          {item.children?.length || 0} items
        </div>
        <div className="flex flex-wrap justify-between">
          {item.children?.map((child) => (
            <Icon
              key={child.id}
              name={child.name}
              onClick={() => openWindow(child)}
              svg={
                <svg
                  className="w-10 h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {child.type === "folder" ? (
                    <>
                      <path
                        d="M5 10h30v25H5z"
                        fill="white"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 5h20v5H10z"
                        fill="white"
                        stroke="black"
                        strokeWidth="2"
                      />
                    </>
                  ) : child.type === "link" ? (
                    <>
                      <rect
                        x="5"
                        y="5"
                        width="30"
                        height="30"
                        fill="white"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <path
                        d="M15 20h10M20 15l5 5-5 5"
                        stroke="black"
                        strokeWidth="2"
                      />
                    </>
                  ) : (
                    <>
                      <rect
                        x="5"
                        y="5"
                        width="30"
                        height="30"
                        fill="white"
                        stroke="black"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 10h20v5H10zM10 20h20M10 25h20M10 30h10"
                        stroke="black"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              }
            />
          ))}
        </div>
      </>
    );
  } else if (item.type === "file") {
    return (
      <div className="font-chicago text-sm whitespace-pre-wrap">
        {item.content}
      </div>
    );
  } else if (item.type === "link") {
    return (
      <div className="font-chicago text-sm">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Open {item.name} in a new window
        </a>
      </div>
    );
  }
  return null;
};

export function RetroMac() {
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(0);

  const openWindow = useCallback(
    (item: FileSystemItem) => {
      if (item.type === "link") {
        window.open(item.url, "_blank", "noopener,noreferrer");
        return;
      }

      setWindows((prev) => [
        ...prev,
        {
          id: item.id,
          title: item.name,
          content: <WindowContent item={item} openWindow={openWindow} />,
          position: {
            x: 50 + Math.random() * 100,
            y: 50 + Math.random() * 100,
          },
          zIndex: maxZIndex + 1,
        },
      ]);
      setMaxZIndex((prev) => prev + 1);
    },
    [maxZIndex]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) => {
        const newWindows = prev.filter((w) => w.id !== id);
        const focusedWindow = prev.find((w) => w.id === id);
        if (focusedWindow) {
          newWindows.push({ ...focusedWindow, zIndex: maxZIndex + 1 });
        }
        return newWindows;
      });
      setMaxZIndex((prev) => prev + 1);
    },
    [maxZIndex]
  );

  const updateWindowPosition = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position: newPosition } : w))
      );
    },
    []
  );

  return (
    <div
      className="h-screen font-sans text-black overflow-hidden"
      style={{
        background: `
        radial-gradient(circle, #000 0.5px, transparent 0.5px) 0 0 / 8px 8px,
        radial-gradient(circle, #000 0.5px, transparent 0.5px) 4px 4px / 8px 8px
      `,
        backgroundColor: "#CECECE",
      }}
    >
      <MenuBar />

      <Desktop fileSystem={fileSystemData} openWindow={openWindow} />

      {windows.map((window) => (
        <MacWindow
          key={window.id}
          title={window.title}
          position={window.position}
          zIndex={window.zIndex}
          onClose={() => closeWindow(window.id)}
          onFocus={() => focusWindow(window.id)}
          onDragEnd={(newPosition) =>
            updateWindowPosition(window.id, newPosition)
          }
        >
          {window.content}
        </MacWindow>
      ))}

      <div className="absolute bottom-4 right-4">
        <Icon
          name="About This Mac"
          onClick={() =>
            openWindow({
              id: "about",
              name: "About This Mac",
              type: "file",
              content: `
Garox's Macintosh IIfx

Age: 26
Location: Santiago, Chile
Work: CTO @ Reccupera

System Software 7.0.1
            `,
            })
          }
          svg={
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="8"
                width="32"
                height="24"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <rect
                x="8"
                y="12"
                width="24"
                height="16"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
