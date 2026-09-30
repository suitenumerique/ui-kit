import { FocusEvent, useLayoutEffect, useState } from "react";

/** Scrolls `root` the least needed for `element` to be fully visible in it. */
const scrollIntoRoot = (root: HTMLElement, element: Element) => {
  const rootTop = root.getBoundingClientRect().top + root.clientTop;
  const rootBottom = rootTop + root.clientHeight;
  const { top, bottom } = element.getBoundingClientRect();
  if (top < rootTop) {
    root.scrollTop -= rootTop - top;
  } else if (bottom > rootBottom) {
    root.scrollTop += bottom - rootBottom;
  }
};

/**
 * Tells whether the root menu is too short to show its top/bottom messages
 * along with one item of its list. The list then stops scrolling on its own so
 * that the whole menu scrolls as one, instead of nesting the list scroll in the
 * menu scroll.
 */
export const useSingleScroll = () => {
  const [root, rootRef] = useState<HTMLDivElement | null>(null);
  const [isSingleScroll, setIsSingleScroll] = useState(false);

  // React Aria cannot scroll the focused item into view in this mode: it
  // scrolls the list, which no longer scrolls, then recenters the whole list
  // in the root whenever the item had to move. Bringing the item into view on
  // focus, before React Aria scrolls, leaves it nothing to move.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (isSingleScroll && event.target.closest(".c__dropdown-menu__list")) {
      scrollIntoRoot(event.currentTarget, event.target);
    }
  };

  useLayoutEffect(() => {
    if (!root) return;
    const measure = () => {
      // The list counts for its min-height, which it keeps in both modes, so
      // switching mode never flips the result back.
      const neededHeight = Array.from(root.children).reduce(
        (height, child) =>
          height +
          (child.classList.contains("c__dropdown-menu__list")
            ? parseFloat(getComputedStyle(child).minHeight) || 0
            : child.getBoundingClientRect().height),
        0,
      );
      // Tolerance for the rounding of `clientHeight`.
      setIsSingleScroll(root.clientHeight + 1 < neededHeight);
    };
    measure();
    // The popover caps the root height on viewport resize, and messages can
    // resize without a render of DropdownMenu.
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    Array.from(root.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [root]);

  return { isSingleScroll, rootRef, onFocus };
};
