import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";

type ShowMoreButtonProps = {
  show: boolean;
  onShowMore?: () => void;
  /** Accessible name that tells the paginated lists apart. */
  label: string;
};

/** Renders a shared pagination action when a list has more items. */
export const ShowMoreButton = ({
  show,
  onShowMore,
  label,
}: ShowMoreButtonProps) => {
  const { t } = useCunningham();
  if (!show) return null;
  return (
    <div className="c__share-modal__show-more-button">
      <Button
        variant="tertiary"
        size="small"
        icon={
          <span className="material-icons" aria-hidden="true">
            arrow_downward
          </span>
        }
        onClick={onShowMore}
        aria-label={label}
      >
        {t("components.share.members.load_more")}
      </Button>
    </div>
  );
};
