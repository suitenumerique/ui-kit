import { Button } from ":/cunningham";
import { Spinner } from ":/components/loader/Spinner";
import { GenericSupportFormLabels } from "./types";

type SupportFormFooterProps = {
  labels: GenericSupportFormLabels;
  onCancel: () => void;
  /** While sending: Send shows a spinner, and neither button acts. */
  isBusy: boolean;
};

export const SupportFormFooter = ({
  labels,
  onCancel,
  isBusy,
}: SupportFormFooterProps) => {
  let sendLabel = labels.send;
  if (isBusy) sendLabel = labels.sending;

  return (
    <div className="c__generic-support-form__footer">
      <Button
        type="button"
        color="brand"
        variant="bordered"
        onClick={onCancel}
        aria-disabled={isBusy}
        fullWidth
      >
        {labels.cancel}
      </Button>
      <Button
        type="submit"
        color="brand"
        aria-disabled={isBusy}
        icon={isBusy && <Spinner size="sm" />}
        fullWidth
      >
        {sendLabel}
      </Button>
    </div>
  );
};
