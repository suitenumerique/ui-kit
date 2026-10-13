import React from "react";
import classNames from "classnames";
import { Button } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { CloseIcon } from "./CloseIcon";
import { ModalFooter } from "./ModalFooter";
import { ModalDefaultVariantProps } from "./index";

export const ModalDefaultLayout = ({
  titleVariant = "default",
  showCloseButton,
  titleId,
  subtitleId,
  ...props
}: ModalDefaultVariantProps & {
  showCloseButton: boolean;
  titleId: string;
  subtitleId: string;
}) => {
  const { t } = useCunningham();
  const isCompact = titleVariant === "compact";
  const closeLabel = t("components.modals.close_button_aria_label");

  // An icon alone must not produce an empty heading.
  const TitleTag = props.title ? "h2" : "div";
  const title = (props.titleIcon || props.title) && (
    <TitleTag
      id={props.title ? titleId : undefined}
      className={classNames("c__modal__title", {
        "c__modal__title--compact": isCompact,
      })}
    >
      {props.titleIcon && (
        <span className="c__modal__title-icon" aria-hidden="true">
          {props.titleIcon}
        </span>
      )}
      {props.title}
    </TitleTag>
  );

  return (
    <>
      <div
        className={classNames("c__modal__scroller", {
          "c__modal__scroller--compact": isCompact,
        })}
      >
        {isCompact ? (
          <div className="c__modal__header c__modal__header--compact">
            {title}
            {showCloseButton && (
              <Button
                icon={<CloseIcon />}
                variant="tertiary"
                color="neutral"
                size="small"
                aria-label={closeLabel}
                onClick={props.onClose}
              />
            )}
          </div>
        ) : (
          <>
            {showCloseButton && (
              <div className="c__modal__close">
                <Button
                  icon={<CloseIcon />}
                  variant="tertiary"
                  color="neutral"
                  size="small"
                  aria-label={closeLabel}
                  onClick={props.onClose}
                />
              </div>
            )}
            {title}
            {props.subtitle && (
              <div id={subtitleId} className="c__modal__subtitle">
                {props.subtitle}
              </div>
            )}
          </>
        )}

        <div className="c__modal__content">{props.children}</div>
        {!props.stickyFooter && <ModalFooter {...props} />}
      </div>
      {props.stickyFooter && <ModalFooter {...props} sticky />}
    </>
  );
};
