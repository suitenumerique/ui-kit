import { ReactNode } from "react";
import clsx from "clsx";
import { ToastAction, ToastType } from "./types";

type ToastContentProps = {
  message: ReactNode;
  icon?: ReactNode;
  type?: ToastType;
  actions?: ToastAction[];
  progress?: number;
};

export const ToastContent = ({
  message,
  icon,
  actions,
  progress,
}: ToastContentProps) => {
  const hasActions = actions && actions.length > 0;

  return (
    <div className="c__toast-content">
      {icon && <span className="c__toast-content__icon">{icon}</span>}
      <span className="c__toast-content__message">
        <span className="c__toast-content__text">{message}</span>
        {progress !== undefined && (
          <span className="c__toast-content__progress">{progress}%</span>
        )}
      </span>
      {hasActions && (
        <div className="c__toast-content__actions">
          {actions.map((action) => (
            <button
              key={action.label}
              className={clsx("c__toast-content__action")}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
