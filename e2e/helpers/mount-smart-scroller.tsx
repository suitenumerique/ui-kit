import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { SmartScroller } from "../../src/components/smart-scroller/SmartScroller";

// Playwright CT bridges function props one-way, so tests declare scenarios via
// plain data and this helper (which runs in the browser) builds the actual
// children locally. The outer frame carries `data-testid="frame"` so resize
// tests can change its width at runtime to trigger the component's
// ResizeObserver.
interface TestSmartScrollerProps {
  /** Number of fixed-width items rendered inside the scroller. */
  itemCount: number;
  /** Forwarded to SmartScroller; defaults to its own default (0.5). */
  scrollRatio?: number;
  /** Width of the bounding frame the scroller must overflow against. */
  frameWidth?: number;
  /** Width of each item; `itemCount * itemWidth` decides whether it overflows. */
  itemWidth?: number;
}

export const TestSmartScroller = ({
  itemCount,
  scrollRatio,
  frameWidth = 480,
  itemWidth = 120,
}: TestSmartScrollerProps) => {
  return (
    <CunninghamProvider currentLocale="en-US">
      <div
        data-testid="frame"
        style={{
          width: frameWidth,
          border: "1px solid var(--c--contextuals--border--surface--primary)",
          borderRadius: 8,
          padding: 8,
        }}
      >
        <SmartScroller scrollRatio={scrollRatio}>
          {Array.from({ length: itemCount }, (_, i) => (
            <div
              key={i}
              data-testid={`item-${i}`}
              style={{
                flex: "0 0 auto",
                width: itemWidth,
                height: 40,
                marginInline: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                borderRadius: 20,
                background:
                  "var(--c--contextuals--background--surface--secondary)",
              }}
            >
              Item {i + 1}
            </div>
          ))}
        </SmartScroller>
      </div>
    </CunninghamProvider>
  );
};
