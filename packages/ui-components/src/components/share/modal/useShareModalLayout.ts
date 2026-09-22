import { useLayoutEffect, useState } from "react";

/** Keeps the list height in sync with the viewport, search field, and footer. */
export const useShareModalLayout = (isMobile: boolean) => {
  const [searchField, searchFieldRef] = useState<HTMLDivElement | null>(null);
  const [footer, footerRef] = useState<HTMLDivElement | null>(null);
  const [listHeight, setListHeight] = useState("400px");
  // Preserve the modal's existing viewport, title and spacing allowances.
  const contentHeight = isMobile
    ? "calc(100dvh - 32px)"
    : "min(690px, calc(100dvh - 2em - 12px - 32px))";

  useLayoutEffect(() => {
    if (!footer) return;
    const measure = () => {
      setListHeight(
        `calc(${contentHeight} - ${footer.clientHeight}px - ${searchField?.clientHeight ?? 0}px - 24px)`,
      );
    };
    measure();
    // Chips can wrap and consumer footer content can resize without a render
    // of ShareModal. Observe those elements rather than relying on ref timing.
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    if (searchField) observer.observe(searchField);
    return () => observer.disconnect();
  }, [contentHeight, footer, searchField]);

  return { listHeight, searchFieldRef, footerRef };
};
