import { useEffect, useState } from "react";

const matchQuery = (query: string) =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia(query).matches;

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => matchQuery(query));

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mediaQueryList = window.matchMedia(query);
    const onChange = () => setMatches(mediaQueryList.matches);
    onChange();
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};
