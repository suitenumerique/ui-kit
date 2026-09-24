import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ArrowRight } from ":/components/icon/icons/ArrowRight";
import { NotificationContent } from ":/components/notification/NotificationContent";
import { VariantType } from ":/utils/VariantUtils";
import { ToastProps } from "./types";

export * from "./types";

const toastDefaultIcon = <ArrowRight size={24} />;

export const Toast = ({
  type,
  duration,
  onDelete,
  disableAnimate,
  ...props
}: ToastProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [disappear, setDisappear] = useState(false);

  // Only a toast mounted on its own schedules its dismissal. Inside
  // `ToastProvider`, react-toastify owns the timer and withholds `duration`,
  // so the two never race to remove the same toast.
  const ownsTimer = duration !== undefined && !disableAnimate;

  useEffect(() => {
    if (!ownsTimer) {
      return;
    }
    const timeout = setTimeout(() => setDisappear(true), duration);
    return () => clearTimeout(timeout);
  }, [ownsTimer, duration]);

  useEffect(() => {
    if (!disappear) {
      return;
    }
    let dropped = false;
    const removeAfterAnimation = async () => {
      // `getAnimations` is missing in jsdom, where there is nothing to wait for.
      const animations = container.current?.getAnimations?.() ?? [];
      await Promise.allSettled(
        animations.map((animation) => animation.finished),
      );
      if (!dropped) {
        onDelete?.();
      }
    };
    void removeAfterAnimation();
    return () => {
      dropped = true;
    };
  }, [disappear, onDelete]);

  return (
    <div
      ref={container}
      className={classNames("c__toast", type && "c__toast--" + type, {
        "c__toast--disappear": disappear,
        "c__toast--no-animate": disableAnimate,
      })}
      role="alert"
    >
      <NotificationContent
        block="c__toast"
        type={type}
        icon={props.icon}
        defaultIcon={toastDefaultIcon}
        hideIcon={props.hideIcon}
        iconAriaHidden
        actions={props.actions}
        primaryLabel={props.primaryLabel}
        primaryOnClick={props.primaryOnClick}
        primaryProps={props.primaryProps}
        tertiaryLabel={props.tertiaryLabel}
        tertiaryOnClick={props.tertiaryOnClick}
        tertiaryProps={props.tertiaryProps}
        canClose={props.canClose}
        onClose={() => props.closeToast?.()}
        trailing={
          props.progress !== undefined && (
            <span className="c__toast__content__progress">
              {props.progress}%
            </span>
          )
        }
      >
        {props.children}
      </NotificationContent>
    </div>
  );
};

export const ToastIcon = ({
  icon,
  hideIcon,
}: Pick<ToastProps, "icon" | "hideIcon">) => {
  if (hideIcon) {
    return null;
  }
  return (
    <div className="c__toast__icon" aria-hidden="true">
      {icon ?? toastDefaultIcon}
    </div>
  );
};
