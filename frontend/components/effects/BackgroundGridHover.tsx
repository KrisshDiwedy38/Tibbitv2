"use client";

import { useEffect, useState, useRef } from "react";

interface Square {
  id: string;
  x: number;
  y: number;
}

const GRID_TRAIL_COLOR = '#00C44F';

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
        const next = [...prev, { id, x, y }];
        // Cap array size to prevent unbounded growth on fast mouse movement
        return next.length > 50 ? next.slice(-50) : next;
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
            backgroundColor: GRID_TRAIL_COLOR,
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
