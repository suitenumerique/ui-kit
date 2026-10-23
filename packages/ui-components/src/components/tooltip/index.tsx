import React, {
  DOMAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { OverlayArrow } from "react-aria-components";
import {
  mergeProps,
  useOverlayPosition,
  useTooltip,
  useTooltipTrigger,
} from "react-aria";
import { useTooltipTriggerState } from "react-stately";
import classNames from "classnames";
import { mergeRefs } from ":/utils/mergeRefs";

const ANIMATION_DURATION = 200;

export interface TooltipProps extends PropsWithChildren {
  placement?: "top" | "bottom" | "left" | "right";
  content: ReactNode;
  closeDelay?: number;
  className?: string;
}

/**
 * Props a parent trigger (such as `DropdownMenu`) injects into the Tooltip.
 * They are forwarded to the Tooltip's child, so it can be nested in a trigger.
 */
type TooltipForwardedProps = DOMAttributes<Element> & { ref?: Ref<Element> };

type TooltipChild = ReactElement<
  DOMAttributes<Element> & { ref?: Ref<Element> }
>;

export const Tooltip = ({
  placement = "bottom",
  content,
  closeDelay = 150,
  className,
  children,
  ref: forwardedRef,
  ...forwardedProps
}: TooltipProps & TooltipForwardedProps) => {
  const ref = React.useRef(null);
  const overlayRef = React.useRef(null);
  const [isExiting, setIsExiting] = React.useState(false);
  const [isEntering, setIsEntering] = React.useState(false);
  const state = useTooltipTriggerState({
    delay: 0,
    closeDelay,
    onOpenChange: (isOpen) => {
      if (isOpen) {
        setIsEntering(true);
        setTimeout(() => {
          setIsEntering(false);
        }, ANIMATION_DURATION);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          setIsExiting(false);
        }, ANIMATION_DURATION);
      }
    },
  });

  // Get props for the trigger and its tooltip
  const useTooltipTriggerRes = useTooltipTrigger({}, state, ref);

  // overlayPosition.placement can be difference than placement, based on available screen space.
  const overlayPosition = useOverlayPosition({
    targetRef: ref,
    overlayRef,
    placement,
    isOpen: state.isOpen,
  });

  const { tooltipProps: tooltipProps2 } = useTooltip(
    useTooltipTriggerRes.tooltipProps,
    state,
  );

  const arrowProps = {
    placement: overlayPosition.placement,
  };

  const showTooltip = state.isOpen || isExiting;
  const child = React.Children.toArray(children)[0] as TooltipChild;

  return (
    <>
      {React.cloneElement(child, {
        ...mergeProps(
          child.props,
          forwardedProps,
          useTooltipTriggerRes.triggerProps,
        ),
        ref: mergeRefs(child.props.ref, forwardedRef, ref),
      })}

      {showTooltip && (
        <span
          className={classNames(
            "c__tooltip",
            {
              "c__tooltip--exiting": isExiting,
              "c__tooltip--entering": isEntering,
            },
            className,
          )}
          data-placement={overlayPosition.placement}
          ref={overlayRef}
          style={{
            ...overlayPosition.overlayProps.style,
          }}
          {...tooltipProps2}
        >
          <OverlayArrow {...arrowProps}>
            <svg width={16} height={16} viewBox="0 0 16 16">
              <path d="M0 0 L8 8 L16 0" />
            </svg>
          </OverlayArrow>
          <span className="c__tooltip__content">{content}</span>
        </span>
      )}
    </>
  );
};
