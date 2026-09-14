/**
 * jsdom parses CSS animations but never runs them, so it never dispatches
 * `animationend`. Components that drive state from that event therefore stall:
 * react-toastify uses it both to settle its enter/exit transitions and to time
 * the dismissal of a toast.
 *
 * This mock completes animations instead of leaving them pending:
 *  - a listener registered directly on an element resolves on the next tick,
 *    which covers class-based enter/exit transitions;
 *  - an element animated through inline styles resolves after its declared
 *    duration, which covers timers and keeps `duration` meaningful in tests.
 */
const cssAnimationMock = () => {
  let originalAddEventListener: typeof HTMLElement.prototype.addEventListener;
  let observer: MutationObserver | undefined;
  const pending = new Map<Element, ReturnType<typeof setTimeout>>();

  const end = (element: Element) =>
    element.dispatchEvent(new Event("animationend", { bubbles: true }));

  const syncInlineAnimation = (element: Element) => {
    const { animationPlayState, animationDuration } = (element as HTMLElement)
      .style;

    if (animationPlayState !== "running") {
      clearTimeout(pending.get(element));
      pending.delete(element);
      return;
    }
    if (pending.has(element)) {
      return;
    }

    const duration = /^([\d.]+)(ms|s)$/.exec(animationDuration);
    if (!duration) {
      return;
    }

    const ms =
      parseFloat(duration[1]) * (duration[2] === "s" ? 1000 : 1) || undefined;
    pending.set(
      element,
      setTimeout(() => {
        pending.delete(element);
        end(element);
      }, ms),
    );
  };

  beforeAll(() => {
    originalAddEventListener = HTMLElement.prototype.addEventListener;
    HTMLElement.prototype.addEventListener = function (
      this: HTMLElement,
      type: string,
      ...rest: unknown[]
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      originalAddEventListener.apply(this, [type, ...rest] as any);
      if (type === "animationend") {
        setTimeout(() => end(this));
      }
    } as typeof originalAddEventListener;

    observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") {
          syncInlineAnimation(record.target as Element);
          continue;
        }
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            syncInlineAnimation(node);
            node.querySelectorAll("*").forEach(syncInlineAnimation);
          }
        });
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });

  afterAll(() => {
    HTMLElement.prototype.addEventListener = originalAddEventListener;
    observer?.disconnect();
    pending.forEach(clearTimeout);
    pending.clear();
  });
};

cssAnimationMock();
