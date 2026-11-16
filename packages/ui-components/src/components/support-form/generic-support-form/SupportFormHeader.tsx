import { Button } from ":/cunningham";

type SupportFormHeaderProps = {
  /** Id of the title: it names the dialog. */
  titleId: string;
  title: string;
  /** Hidden on the success view. */
  subtitle?: string;
  closeLabel: string;
  onClose: () => void;
  /** While sending, the form can't be closed. */
  isBusy: boolean;
};

export const SupportFormHeader = ({
  titleId,
  title,
  subtitle,
  closeLabel,
  onClose,
  isBusy,
}: SupportFormHeaderProps) => (
  <div className="c__generic-support-form__header">
    <div className="c__generic-support-form__header__text">
      <h3 className="c__generic-support-form__title" id={titleId}>
        {title}
      </h3>
      {subtitle && (
        <p className="c__generic-support-form__subtitle">{subtitle}</p>
      )}
    </div>
    <Button
      type="button"
      className="c__generic-support-form__close"
      color="neutral"
      variant="tertiary"
      size="small"
      icon={
        <span className="material-icons" aria-hidden="true">
          close
        </span>
      }
      onClick={onClose}
      aria-disabled={isBusy}
      aria-label={closeLabel}
    />
  </div>
);
