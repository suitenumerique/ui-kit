import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ToastContainer,
  cssTransition,
  toast as notify,
} from "react-toastify/unstyled";
import { Toast, ToastProps } from ":/components/toast/index";
import { useCunningham } from ":/components/provider";
import { VariantType } from ":/utils/VariantUtils";
import {
  ToastDismissParams,
  ToastId,
  ToastPosition,
  ToastUpdateOptions,
} from "./types";

const ToastSlide = cssTransition({
  enter: "c__toast__wrapper--slide-in",
  exit: "c__toast__wrapper--slide-out",
});

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
/** Long enough for focus to settle after a dialog closes, before the polite announcement. */
const ANNOUNCE_DELAY_MS = 120;
const DEFAULT_TOAST_SHORTCUT = "Alt+T";

type ParsedShortcut = {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  code: string;
};

const parseShortcut = (label: string): ParsedShortcut | undefined => {
  const parts = label
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  let altKey = false;
  let ctrlKey = false;
  let metaKey = false;
  let shiftKey = false;
  const keys: string[] = [];
  for (const part of parts) {
    const token = part.toLowerCase();
    if (token === "alt" || token === "option") {
      altKey = true;
    } else if (token === "ctrl" || token === "control") {
      ctrlKey = true;
    } else if (token === "meta" || token === "cmd" || token === "command") {
      metaKey = true;
    } else if (token === "shift") {
      shiftKey = true;
    } else {
      keys.push(part);
    }
  }
  const key = keys[keys.length - 1];
  if (!key) {
    return undefined;
  }
  const code =
    key.length === 1 && /[a-z]/i.test(key) ? `Key${key.toUpperCase()}` : key;
  return { altKey, ctrlKey, metaKey, shiftKey, code };
};

const matchesShortcut = (event: KeyboardEvent, shortcut: ParsedShortcut) =>
  event.altKey === shortcut.altKey &&
  event.ctrlKey === shortcut.ctrlKey &&
  event.metaKey === shortcut.metaKey &&
  event.shiftKey === shortcut.shiftKey &&
  event.code === shortcut.code;

const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

// `neutral` is our name for what react-toastify calls the untyped toast.
const toastifyType = (type: VariantType) =>
  type === VariantType.NEUTRAL ? "default" : type;

/** What a live toast was last rendered with, so an update can build on it. */
type ToastState = {
  message: string;
  type: VariantType;
  /** Kept off `props` so an update can rebuild the timer from it. */
  duration?: number;
  props: Partial<Omit<ToastProps, "type" | "duration">>;
};

// `disableAnimate` opts out of the timer. Otherwise the toast's own duration
// wins, and a toast raised without one uses the default.
const autoCloseOf = (state: ToastState): number | false =>
  state.props.disableAnimate
    ? false
    : (state.duration ?? DEFAULT_TOAST_DURATION);

// The provider owns the dismissal here, so the component must not run its own
// timer: `onDelete` is consumed as a react-toastify option and deliberately
// kept out of the rendered element.
const renderToast = ({ message, type, props }: ToastState) => {
  const { onDelete: _onDelete, ...presentation } = props;
  return (
    <Toast {...presentation} type={type}>
      {message}
    </Toast>
  );
};

export interface ToastProviderProps extends PropsWithChildren {
  /** Corner the toast sits in. The slide follows that side. Defaults to `bottom-left`. */
  position?: ToastPosition;
  /**
   * Pins the container to a known id. Each provider is already isolated with a
   * generated one, so this is only needed to target it from somewhere else.
   */
  containerId?: string;
  /**
   * Shortcut that moves focus to the first visible toast.
   * Defaults to `Alt+T`. Pass `false` to disable it.
   * The live region's accessible name includes this shortcut.
   */
  shortcut?: string | false;
}

export const ToastProvider = ({
  children,
  position = "bottom-left",
  containerId,
  shortcut = DEFAULT_TOAST_SHORTCUT,
}: ToastProviderProps) => {
  // `toast()` dispatches globally, so without an id every container would
  // compete for the default one and the last mounted would win. Scoping each
  // provider to its own container keeps notifications where they were raised,
  // which is what resolving the provider through context used to guarantee.
  const ownId = useId();
  const target = containerId ?? ownId;
  const { t } = useCunningham();

  // Updating a toast means rebuilding the component with merged props, so keep
  // track of what each live toast was last rendered with.
  const live = useRef(new Map<ToastId, ToastState>());
  const counter = useRef(0);
  const returnFocus = useRef(new Map<string, HTMLElement>());
  const announceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [announcement, setAnnouncement] = useState("");

  const clearAnnounceTimer = () => {
    if (announceTimer.current !== undefined) {
      clearTimeout(announceTimer.current);
      announceTimer.current = undefined;
    }
  };

  const announce = useCallback((message: string) => {
    clearAnnounceTimer();
    setAnnouncement("");
    announceTimer.current = setTimeout(() => {
      setAnnouncement(message);
    }, ANNOUNCE_DELAY_MS);
  }, []);

  useEffect(() => clearAnnounceTimer, []);

  const context: ToastProviderContext = useMemo(
    () => ({
      toast: (message, type = VariantType.NEUTRAL, options = {}) => {
        const { duration, ...props } = options;
        // Minting the id up front lets `onClose` release the entry it created.
        const id = `${target}-${(counter.current += 1)}`;
        const state: ToastState = { message, type, duration, props };
        live.current.set(id, state);
        announce(message);

        return notify(renderToast(state), {
          toastId: id,
          type: toastifyType(type),
          autoClose: autoCloseOf(state),
          icon: false,
          onClose: () => {
            const back = returnFocus.current.get(id);
            returnFocus.current.delete(id);
            live.current.delete(id);
            props.onDelete?.();
            const node = document.getElementById(id);
            const active = document.activeElement;
            if (
              back?.isConnected &&
              node &&
              active instanceof Node &&
              node.contains(active)
            ) {
              back.focus();
            }
          },
          containerId: target,
        });
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

        notify.update(id, {
          containerId: target,
          type: toastifyType(next.type),
          render: renderToast(next),
          autoClose: autoCloseOf(next),
        });
      },
      dismissToast: (params) =>
        notify.dismiss(
          typeof params === "object"
            ? params
            : { id: params, containerId: target },
        ),
    }),
    [announce, target],
  );

  const hotKeys = useMemo(() => {
    if (shortcut === false) {
      return () => false;
    }
    const parsed = parseShortcut(shortcut);
    if (!parsed) {
      return () => false;
    }
    return (event: KeyboardEvent) => matchesShortcut(event, parsed);
  }, [shortcut]);

  const liveRegionLabel =
    shortcut === false
      ? t("components.toast.region_aria_label")
      : t("components.toast.region_shortcut_aria_label", {
          shortcut,
        });

  useEffect(() => {
    const owns = (node: EventTarget | null) => {
      if (!(node instanceof Element)) {
        return undefined;
      }
      const toast = node.closest(".Toastify__toast");
      if (!(toast instanceof HTMLElement) || !toast.id) {
        return undefined;
      }
      const root = document.getElementById(target);
      if (!root?.contains(toast)) {
        return undefined;
      }
      return toast;
    };

    const onFocusIn = (event: FocusEvent) => {
      const toast = owns(event.target);
      if (!toast) {
        return;
      }
      const from = event.relatedTarget;
      if (from instanceof HTMLElement && !toast.contains(from)) {
        returnFocus.current.set(toast.id, from);
      }
      notify.pause({ id: toast.id, containerId: target });
    };

    const onFocusOut = (event: FocusEvent) => {
      const toast = owns(event.target);
      if (!toast) {
        return;
      }
      const next = event.relatedTarget;
      if (next instanceof Node && toast.contains(next)) {
        return;
      }
      notify.play({ id: toast.id, containerId: target });
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [target]);

  return (
    <ToastContext.Provider value={context}>
      <ToastContainer
        className={`c__toast__container c__toast__container--slide-${slideSideFromPosition(position)}`}
        toastClassName="c__toast__wrapper"
        position={position}
        containerId={target}
        autoClose={DEFAULT_TOAST_DURATION}
        // `Toast` carries `status` or `alert` itself, so a standalone one is
        // announced too. Leaving the default here would nest a second one.
        role="presentation"
        aria-label={t("components.toast.region_aria_label")}
        hotKeys={hotKeys}
        hideProgressBar
        // The dismissal timer used to be a plain timeout, so it kept running
        // when the window lost focus. Keep it that way.
        pauseOnFocusLoss={false}
        closeOnClick={false}
        closeButton={false}
        draggable={false}
        transition={ToastSlide}
      />
      <section
        className="c__toast__live-region"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
        aria-label={liveRegionLabel}
        style={visuallyHidden}
      >
        {announcement}
      </section>
      {children}
    </ToastContext.Provider>
  );
};
