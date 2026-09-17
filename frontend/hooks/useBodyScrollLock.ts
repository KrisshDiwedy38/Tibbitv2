"use client";

import { useEffect, useRef } from "react";

/**
 * Locks body scroll when `isLocked` is true.
 *
 * Pins the body via `position: fixed` with a negative top offset matching the
 * current scroll position, then restores that scroll position on unlock. Plain
 * `overflow: hidden` doesn't reliably preserve scroll position on mobile
 * browsers — the page can visually snap to the top the moment the lock engages.
 */
export function useBodyScrollLock(isLocked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;

    scrollYRef.current = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollYRef.current}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isLocked]);
}
