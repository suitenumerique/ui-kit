import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { Zoom1, ZoomMinus, ZoomPlus } from ":/components/icon/icons";

interface ZoomControlsProps {
  zoomOut: () => void;
  zoomIn: () => void;
  resetView: () => void;
}

export const ZoomControls = ({
  zoomOut,
  zoomIn,
  resetView,
}: ZoomControlsProps) => {
  const { t } = useCunningham();
  return (
    <div className="file-preview__controls__zoom">
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={zoomOut}
        aria-label={t("components.filePreview.actions.zoomOut")}
        icon={<ZoomMinus aria-hidden />}
      />
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={resetView}
        aria-label={t("components.filePreview.actions.zoomReset")}
        icon={<Zoom1 aria-hidden />}
      />
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={zoomIn}
        aria-label={t("components.filePreview.actions.zoomIn")}
        icon={<ZoomPlus aria-hidden />}
      />
    </div>
  );
};
