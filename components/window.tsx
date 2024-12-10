"use client";
import { motion } from "framer-motion";

export const MacWindow = ({
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
