import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from "react";
import classNames from "classnames";
import isChromatic from "chromatic/isChromatic";
import { Button, ButtonProps } from ":/components/button";
import { iconFromType, VariantType } from ":/utils/VariantUtils";
import { ToastAction } from "./types";

export * from "./types";

export interface ToastProps extends PropsWithChildren {
  duration: number;
  type: VariantType;
  onDelete?: () => void;
  icon?: ReactNode;
  primaryLabel?: string;
  primaryOnClick?: ButtonProps["onClick"];
  primaryProps?: ButtonProps;
  disableAnimate?: boolean;
  /**
   * Either a ready-made node, or a list of `{ label, onClick }` rendered as
   * borderless buttons matching the toast variant.
   */
  actions?: ReactNode | ToastAction[];
  /** Completion percentage, displayed next to the message. */
  progress?: number;
}

// `actions` accepts both a node and a list of descriptors. React elements never
// carry `label`/`onClick` as own keys, so they cannot be mistaken for one.
const isActionList = (
  actions: ReactNode | ToastAction[],
): actions is ToastAction[] =>
  Array.isArray(actions) &&
  actions.every(
    (action) =>
      typeof action === "object" &&
      action !== null &&
      "label" in action &&
      "onClick" in action,
  );

const ToastActions = ({
  actions,
  primaryLabel,
  primaryOnClick,
  primaryProps,
}: Pick<
  ToastProps,
  "actions" | "primaryLabel" | "primaryOnClick" | "primaryProps"
>) => {
  const hasActions = isActionList(actions) ? actions.length > 0 : !!actions;
  if (!hasActions && !primaryLabel) {
    return null;
  }

  return (
    <div className="c__toast__content__actions">
      {isActionList(actions)
        ? actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="c__toast__content__action"
              onClick={(event) => {
                event.stopPropagation();
                action.onClick();
              }}
            >
              {action.label}
            </button>
          ))
        : actions}
      {primaryLabel && (
        <div className="c__toast__content__buttons">
          {/* Still a Button so `primaryProps` keeps working, but wearing the
              same borderless look as the action list. */}
          <Button
            variant="tertiary"
            className="c__toast__content__action"
            onClick={primaryOnClick}
            {...primaryProps}
          >
            {primaryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export const Toast = ({ type, ...props }: ToastProps) => {
  return (
    <div
      className={classNames("c__toast", type && "c__toast--" + type, {
        "c__toast--no-animate": props.disableAnimate,
      })}
    >
      <div className="c__toast__content">
        <ToastIcon {...props} type={type} />
        <div className="c__toast__content__children">
          <span className="c__toast__content__message">{props.children}</span>
          {props.progress !== undefined && (
            <span className="c__toast__content__progress">
              {props.progress}%
            </span>
          )}
        </div>
        <ToastActions {...props} />
      </div>
    </div>
  );
};

export const ToastIcon = ({ type, ...props }: ToastProps) => {
  const icon = useMemo(() => iconFromType(type), [type]);
  if (props.icon) {
    return (
      <div className="c__toast__icon" aria-hidden="true">
        {props.icon}
      </div>
    );
  }
  if (!icon) {
    return null;
  }
  return (
    <div className="c__toast__icon" aria-hidden="true">
      <span className="material-icons">{icon}</span>
    </div>
  );
};
export const ProgressBar = ({ duration }: { duration: number }) => {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChromatic()) {
      return;
    }
    content.current!.animate([{ width: "0%" }, { width: "100%" }], {
      duration,
      easing: "linear",
    });
  }, []);

  return (
    <div className="c__progress-bar">
      <div className="c__progress-bar__content" ref={content} />
    </div>
  );
};
