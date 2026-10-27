import { Button } from ":/cunningham";
import { IconSize } from ":/components/icon";
import { useCunningham } from ":/components/provider";
import { ArrowDown } from ":/icons";

type ShowMoreButtonProps = {
  show: boolean;
  onShowMore?: () => void;
};

/** Renders a shared pagination action when more members or invitations exist. */
export const ShowMoreButton = ({ show, onShowMore }: ShowMoreButtonProps) => {
  const { t } = useCunningham();
  if (!show) return null;
  return (
    <div className="c__share-modal__show-more-button">
      <Button
        variant="tertiary"
        size="small"
        icon={<ArrowDown size={IconSize.SMALL} aria-hidden />}
        onClick={onShowMore}
      >
        {t("components.share.members.load_more")}
      </Button>
    </div>
  );
};
