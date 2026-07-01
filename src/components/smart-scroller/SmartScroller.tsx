import { useCallback, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { IconSize } from ":/components/icon";
import { ArrowLeft, ArrowRight } from ":/icons";

export type SmartScrollerProps = {
  children: React.ReactNode;
  /** Custom CSS class applied to the root element. */
  className?: string;
  /**
   * Fraction of the visible width scrolled on each arrow click.
   * Defaults to 0.5 (half the viewport).
   */
  scrollRatio?: number;
};

/**
 * A horizontally scrollable container that overlays arrow buttons on the
 * edges where content is hidden by overflow. Clicking an arrow scrolls the
 * viewport by `scrollRatio` of its visible width (smoothly). Each arrow only
 * shows while there is content to reveal on that side, and a gradient fade
 * hints at the partially-cut content underneath.
 */
export const SmartScroller = ({
  children,
  className,
  scrollRatio = 0.5,
}: SmartScrollerProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const { scrollLeft, clientWidth, scrollWidth } = viewport;
    setCanScrollLeft(scrollLeft > 0);
    // 1px tolerance absorbs sub-pixel rounding so the right arrow hides once
    // the end is reached.
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  // Measure on mount, on scroll, and whenever the viewport (container) or its
  // content (children added/removed/grown) is resized.
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) {
      return;
    }
    updateArrows();
    viewport.addEventListener("scroll", updateArrows, { passive: true });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(viewport);
    observer.observe(content);
    return () => {
      viewport.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows]);

  const scrollByRatio = (direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    viewport.scrollBy({
      left: direction * viewport.clientWidth * scrollRatio,
      behavior: "smooth",
    });
  };

  return (
    <div className={clsx("c__smart-scroller", className)}>
      {/*
       * Arrows and fades stay mounted and toggle visibility via a modifier
       * class so their opacity transitions smoothly as scrollability changes
       * (mounting/unmounting would make them pop in and out instantly).
       */}
      <span
        className={clsx(
          "c__smart-scroller__fade c__smart-scroller__fade--left",
          canScrollLeft && "c__smart-scroller__fade--visible"
        )}
      />
      <Button
        className={clsx(
          "c__smart-scroller__arrow c__smart-scroller__arrow--left",
          canScrollLeft && "c__smart-scroller__arrow--visible"
        )}
        onClick={() => scrollByRatio(-1)}
        // Pointer-only affordance: assistive-tech and keyboard users reach
        // the content directly (focusing a child scrolls it into view), so
        // the arrows are hidden from the a11y tree and the tab order.
        aria-hidden="true"
        tabIndex={-1}
        icon={<ArrowLeft size={IconSize.SMALL} />}
        color="neutral"
        variant="bordered"
        size="small"
      />

      <div className="c__smart-scroller__viewport" ref={viewportRef}>
        <div className="c__smart-scroller__content" ref={contentRef}>
          {children}
        </div>
      </div>

      <span
        className={clsx(
          "c__smart-scroller__fade c__smart-scroller__fade--right",
          canScrollRight && "c__smart-scroller__fade--visible"
        )}
      />
      <Button
        className={clsx(
          "c__smart-scroller__arrow c__smart-scroller__arrow--right",
          canScrollRight && "c__smart-scroller__arrow--visible"
        )}
        onClick={() => scrollByRatio(1)}
        aria-hidden="true"
        tabIndex={-1}
        icon={<ArrowRight size={IconSize.SMALL} />}
        color="neutral"
        variant="bordered"
        size="small"
      />
    </div>
  );
};
