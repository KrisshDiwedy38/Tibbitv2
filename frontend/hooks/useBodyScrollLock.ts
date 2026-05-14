"use client";

import { useEffect } from "react";

/**
 * Locks body scroll when `isLocked` is true.
 * Properly cleans up on unmount to prevent scroll lock leaks.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLocked]);
}
