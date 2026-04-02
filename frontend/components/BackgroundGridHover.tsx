"use client";

import { useEffect, useState, useRef } from "react";

interface Square {
  id: string;
  x: number;
  y: number;
  color: string;
}

const BRUT_COLORS = [
  '#0057FF',
  '#00C44F',
  '#FF00A0',
  '#8b06e4ff',
];

function getBrutColor(x: number, y: number): string {
  const index = Math.abs((x / 40 + y / 40) * 3) % BRUT_COLORS.length;
  return BRUT_COLORS[Math.floor(index)];
}

export default function BackgroundGridHover() {
  const [squares, setSquares] = useState<Square[]>([]);
  const timeouts = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.floor(e.pageX / 40) * 40;
      const y = Math.floor(e.pageY / 40) * 40;
      const id = `${x}-${y}`;

      setSquares((prev) => {
        if (prev.some((s) => s.id === id)) return prev;
        return [...prev, { id, x, y, color: getBrutColor(x, y) }];
      });

      if (timeouts.current[id]) clearTimeout(timeouts.current[id]);

      timeouts.current[id] = setTimeout(() => {
        setSquares((prev) => prev.filter((s) => s.id !== id));
        delete timeouts.current[id];
      }, 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-[-1]">
      {squares.map((sq) => (
        <div
          key={sq.id}
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            left: sq.x,
            top: sq.y,
            backgroundColor: sq.color,
            outline: '2px solid #000',
            boxShadow: '3px 3px 0 #000',
            animation: 'grid-fadeout 0.5s ease-out forwards',
          }}
        />
      ))}
      <style>{`
        @keyframes grid-fadeout {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}