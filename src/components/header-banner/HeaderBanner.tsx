import clsx from "clsx";
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { HeaderBannerVariant } from "./types";
import { Button, ButtonProps, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { ExternalLink, XMark } from ":/icons";

export type HeaderBannerProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Message displayed in the banner.
   */
  label: ReactNode;
  /**
   * Visual color driving the background and text colors.
   */
  color?: HeaderBannerVariant;
  /**
   * Optional call to action (href or callback) displayed at the end of the banner.
   * Use `HeaderBannerCTA` for the default styling.
   */
   ctaProps?: { label: string } & Omit<ButtonProps, 'size' | 'variant' | 'color'>;
  /**
   * Called when the close button is clicked. The close button is only rendered
   * when this callback is provided.
   */
  onClose?: () => void;
};

/**
 * Full width banner meant to be displayed at the very top of the screen.
 *
 * It flows in the normal document order (it is not sticky nor fixed): place it
 * as the first element of your layout to keep it pinned above the content.
 */
export const HeaderBanner = ({
  label,
  color = "brand",
  ctaProps,
  onClose,
  className,
  ...props
}: HeaderBannerProps) => {
  const { t } = useCunningham();

  return (
    <div
      className={clsx("c__header-banner", `c__header-banner--${color}`, className)}
      {...props}
    >
      <p className="c__header-banner__label">{label}</p>
      {ctaProps && (
        <div className="c__header-banner__cta">
          <HeaderBannerCTA {...ctaProps} color={color}>
            {ctaProps.label}
          </HeaderBannerCTA>
        </div>
      )}
      {onClose && (
        <Button
          type="button"
          size="nano"
          color={color}
          className="c__header-banner__close"
          icon={<XMark size="small" />}
          aria-label={t("components.headerBanner.close")}
          onClick={onClose}
        />
      )}
    </div>
  );
};

const HeaderBannerCTA = ({ children, ...props }: PropsWithChildren<ButtonProps>) => (
    <Button
        type="button"
        size="nano"
        icon={props.href && <ExternalLink size="small" />}
        {...props}
    >
        {children}
    </Button>
);

export default HeaderBanner;
