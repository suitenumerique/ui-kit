import { RefObject, useLayoutEffect } from "react";

const toggleAttribute = (element: HTMLElement, name: string, on: boolean) => {
  if (on) {
    element.setAttribute(name, "");
  } else {
    element.removeAttribute(name);
  }
};

/**
 * Flags `target` with `data-overflow-top` / `data-overflow-bottom` while the
 * `scroller` content extends past its top or bottom edge. Must run in a
 * component mounted with the scroller, so the refs are set on first effect.
 */
export const useScrollOverflow = (
  scrollerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
) => {
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const target = targetRef.current;
    if (!scroller || !target) {
      return;
    }

    const update = () => {
      const { scrollTop, clientHeight, scrollHeight } = scroller;
      toggleAttribute(target, "data-overflow-top", scrollTop > 0);
      toggleAttribute(
        target,
        "data-overflow-bottom",
        Math.ceil(scrollTop + clientHeight) < scrollHeight,
      );
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(scroller);
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(scroller, { childList: true, subtree: true });

    return () => {
      scroller.removeEventListener("scroll", update);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollerRef, targetRef]);
};
