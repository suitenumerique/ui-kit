import { use, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ArrowRight } from ":/components/icon/icons/ArrowRight";
import { NotificationContent } from ":/components/notification/NotificationContent";
import { CunninghamContext } from ":/components/provider";
import { VariantType } from ":/utils/VariantUtils";
import { ToastProps } from "./types";

export * from "./types";

const toastDefaultIcon = <ArrowRight size={24} />;

// `alert` interrupts the screen reader. Reserve it for the types that need it.
const toastRole = (type?: VariantType) =>
  type === VariantType.WARNING || type === VariantType.ERROR
    ? "alert"
    : "status";

export const Toast = ({
  type,
  duration,
  onDelete,
  disableAnimate,
  closeToast,
  progress,
  children,
  ...shared
}: ToastProps & {
  closeToast?: () => void;
}) => {
  // `use` may sit behind the condition: a toast without a close button still
  // renders outside `CunninghamProvider`.
  const closeLabel =
    shared.closeLabel ??
    (shared.canClose
      ? use(CunninghamContext)?.t("components.toast.close_aria_label")
      : undefined);
  const container = useRef<HTMLDivElement>(null);
  const [disappear, setDisappear] = useState(false);
  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;

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
        onDeleteRef.current?.();
      }
    };
    void removeAfterAnimation();
    return () => {
      dropped = true;
    };
  }, [disappear]);

  return (
    <div
      ref={container}
      className={classNames("c__toast", type && "c__toast--" + type, {
        "c__toast--disappear": disappear,
        "c__toast--no-animate": disableAnimate,
      })}
      role={toastRole(type)}
    >
      <NotificationContent
        {...shared}
        type={type}
        closeLabel={closeLabel}
        defaultIcon={toastDefaultIcon}
        iconAriaHidden
        onClose={() => (closeToast ? closeToast() : setDisappear(true))}
        trailing={
          progress !== undefined && (
            <span className="c__toast__progress" aria-hidden="true">
              {progress}%
            </span>
          )
        }
      >
        {children}
      </NotificationContent>
    </div>
  );
};
