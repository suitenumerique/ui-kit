import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";
import { I18nProvider } from "@react-aria/i18n";
import { announce } from "@react-aria/live-announcer";
import { isActionList } from ":/components/notification/NotificationContent";
import { Toast, ToastProps } from ":/components/toast/index";
import { useCunningham } from ":/components/provider";
import { VariantType } from ":/utils/VariantUtils";
import {
  ToastDismissParams,
  ToastId,
  ToastPosition,
  ToastUpdateOptions,
} from "./types";

const slideSideFromPosition = (position: ToastPosition) =>
  position.includes("right") ? "right" : "left";

export interface ToastProviderContext {
  toast: (
    message: string,
    type?: VariantType,
    options?: Partial<Omit<ToastProps, "type">>,
  ) => ToastId;
  updateToast: (id: ToastId, options?: ToastUpdateOptions) => void;
  dismissToast: (params?: ToastId | ToastDismissParams) => void;
}

const ToastContext = React.createContext<ToastProviderContext | undefined>(
  undefined,
);

export const useToastProvider = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastProvider must be used within a ToastProvider.");
  }
  return context;
};

const DEFAULT_TOAST_DURATION = 6000;
/** Below this, some users cannot read the toast before it goes. */
const MIN_TOAST_DURATION = 5000;
/** Long enough for focus to settle after a dialog closes, before the polite announcement. */
const ANNOUNCE_DELAY_MS = 120;

/** What a live toast was last rendered with, so an update can build on it. */
type ToastState = {
  message: string;
  type: VariantType;
  /** Kept off `props` so an update can rebuild the timer from it. */
  duration?: number;
  props: Partial<Omit<ToastProps, "type" | "duration">>;
};

const isAssertive = (type: VariantType) =>
  type === VariantType.ERROR || type === VariantType.WARNING;

// An error, a warning or a toast the user can act on is not dismissed on its
// own: it may be missed, or acted on too late.
const staysByDefault = ({ type, props }: ToastState) =>
  isAssertive(type) ||
  (isActionList(props.actions) ? props.actions.length > 0 : !!props.actions) ||
  !!props.primaryLabel ||
  !!props.tertiaryLabel;

// `disableAnimate` opts out of the timer. Otherwise the toast's own duration
// wins, then the default unless the toast stays by default.
const timeoutOf = (state: ToastState): number | undefined => {
  if (state.props.disableAnimate) {
    return undefined;
  }
  if (state.duration === undefined && staysByDefault(state)) {
    return undefined;
  }
  return Math.max(state.duration ?? DEFAULT_TOAST_DURATION, MIN_TOAST_DURATION);
};

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// The queue drops a toast from the DOM as soon as it closes, so the slide-out
// runs as a view transition. Browsers without them close it instantly.
const wrapUpdate = (fn: () => void, action: string) => {
  if (
    action === "add" ||
    !("startViewTransition" in document) ||
    prefersReducedMotion()
  ) {
    fn();
    return;
  }
  document.startViewTransition(() => flushSync(fn));
};

export interface ToastProviderProps extends PropsWithChildren {
  /** Corner the toast sits in. The slide follows that side. Defaults to `bottom-left`. */
  position?: ToastPosition;
  /**
   * Pins the region to a known id. Each provider is already isolated with its
   * own queue, so this is only needed to target it from somewhere else.
   */
  containerId?: string;
}

export const ToastProvider = ({
  children,
  position = "bottom-left",
  containerId,
}: ToastProviderProps) => {
  const ownId = useId();
  const target = containerId ?? ownId;
  const { currentLocale } = useCunningham();

  // Each provider owns its queue, so a toast lands where it was raised.
  const [queue] = useState(() => new ToastQueue<ToastId>({ wrapUpdate }));
  // The queue only holds our id. What the toast renders lives here, so an
  // update can change it without re-queuing the toast.
  const live = useRef(new Map<ToastId, ToastState>());
  const keys = useRef(new Map<ToastId, string>());
  const counter = useRef(0);
  const pending = useRef(new Map<ToastId, ReturnType<typeof setTimeout>>());
  const [, rerender] = useReducer((count: number) => count + 1, 0);

  useEffect(() => {
    // The announcer holds back the call that creates it by 100ms, so a toast
    // raised meanwhile would be read before the first one. Create it up front.
    announce("", "polite");
    const timers = pending.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // F6 only cycles through React Aria landmarks. When the region is the only
  // one, it would loop on itself: send focus back to where it came from.
  useEffect(() => {
    let origin: HTMLElement | undefined;
    const region = () => document.getElementById(target);

    const onFocusIn = (event: FocusEvent) => {
      const from = event.relatedTarget;
      const root = region();
      if (
        root?.contains(event.target as Node) &&
        from instanceof HTMLElement &&
        !root.contains(from)
      ) {
        origin = from;
      }
    };

    // On window, in the capture phase, to run before the landmark manager.
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "F6" ||
        event.altKey ||
        !origin?.isConnected ||
        !region()?.contains(document.activeElement)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      origin.focus();
    };

    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [target]);

  const context: ToastProviderContext = useMemo(() => {
    // Every message written while the delay runs is read once, when it ends.
    const scheduleAnnounce = (id: ToastId) => {
      if (pending.current.has(id)) {
        return;
      }
      pending.current.set(
        id,
        setTimeout(() => {
          pending.current.delete(id);
          const state = live.current.get(id);
          if (state) {
            announce(
              state.message,
              isAssertive(state.type) ? "assertive" : "polite",
            );
          }
        }, ANNOUNCE_DELAY_MS),
      );
    };

    const release = (id: ToastId) => {
      clearTimeout(pending.current.get(id));
      pending.current.delete(id);
      const state = live.current.get(id);
      live.current.delete(id);
      keys.current.delete(id);
      state?.props.onDelete?.();
    };

    const enqueue = (id: ToastId) => {
      const state = live.current.get(id)!;
      const key = queue.add(id, {
        timeout: timeoutOf(state),
        // A re-queued toast closes its previous entry: only the current one
        // releases it.
        onClose: () => {
          if (keys.current.get(id) === key) {
            release(id);
          }
        },
      });
      keys.current.set(id, key);
    };

    const close = (id: ToastId) => {
      const key = keys.current.get(id);
      if (key !== undefined) {
        queue.close(key);
      }
    };

    return {
      toast: (message, type = VariantType.NEUTRAL, options = {}) => {
        const { duration, ...props } = options;
        const id = `${target}-${(counter.current += 1)}`;
        live.current.set(id, { message, type, duration, props });
        enqueue(id);
        scheduleAnnounce(id);
        return id;
      },
      updateToast: (id, options = {}) => {
        const current = live.current.get(id);
        if (!current) {
          return;
        }
        const { message, type, duration, ...props } = options;
        const next: ToastState = {
          message: message ?? current.message,
          type: type ?? current.type,
          duration: duration ?? current.duration,
          props: { ...current.props, ...props },
        };
        live.current.set(id, next);

        const after = timeoutOf(next);
        if (duration !== undefined || after !== timeoutOf(current)) {
          const queued = queue.visibleToasts.find(
            (entry) => entry.key === keys.current.get(id),
          );
          if (queued?.timer && after !== undefined) {
            queued.timer.reset(after);
          } else if (queued?.timer || after !== undefined) {
            // The queue sets a timer up only when a toast is added.
            const previous = keys.current.get(id);
            enqueue(id);
            if (previous !== undefined) {
              queue.close(previous);
            }
          }
        }
        rerender();
        if (message !== undefined || type !== undefined) {
          scheduleAnnounce(id);
        }
      },
      dismissToast: (params) => {
        if (typeof params === "object") {
          if (params.containerId !== target) {
            return;
          }
          params = params.id;
        }
        if (params === undefined) {
          [...keys.current.keys()].forEach(close);
        } else {
          close(params);
        }
      },
    };
  }, [queue, target]);

  const side = slideSideFromPosition(position);

  return (
    <ToastContext.Provider value={context}>
      {/* No `aria-label`: the region registers for F6 only when its label
          changes after it mounts, which the built-in count-based one does. */}
      <I18nProvider locale={currentLocale}>
        <ToastRegion
          queue={queue}
          // The region forwards `id` to the DOM, but its props type omits it.
          {...{ id: target }}
          className={`c__toast__region c__toast__region--${position} c__toast__region--slide-${side}`}
        >
          {({ toast }) => {
            const state = live.current.get(toast.content);
            if (!state) {
              return <></>;
            }
            const { onDelete: _onDelete, ...presentation } = state.props;
            const messageId = `${toast.content}-message`;
            return (
              <AriaToast
                toast={toast}
                className="c__toast__item"
                aria-labelledby={messageId}
                style={
                  {
                    viewTransitionName: `c-toast${toast.key}`,
                    viewTransitionClass: `c-toast-${side}`,
                  } as CSSProperties
                }
              >
                <Toast
                  {...presentation}
                  // A toast without a timer needs a way out.
                  canClose={
                    presentation.canClose ?? timeoutOf(state) === undefined
                  }
                  type={state.type}
                  messageId={messageId}
                  suppressLive
                  closeToast={() => queue.close(toast.key)}
                >
                  {state.message}
                </Toast>
              </AriaToast>
            );
          }}
        </ToastRegion>
      </I18nProvider>
      {children}
    </ToastContext.Provider>
  );
};
