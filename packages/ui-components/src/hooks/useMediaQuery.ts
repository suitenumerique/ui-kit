import { useCallback, useSyncExternalStore } from "react";

// Server rendering and jsdom (unit tests) have no matchMedia.
const canMatchMedia = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * Returns whether the CSS media query matches, and re-renders the
 * component when it starts or stops matching.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatchMedia()) return () => {};
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);
      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = () => canMatchMedia() && window.matchMedia(query).matches;

  // Assume a large screen during server rendering.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
