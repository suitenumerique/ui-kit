import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Zoom1, ZoomMinus, ZoomPlus } from ":/components/icon";

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
  return (
    <div className="file-preview__controls__zoom">
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={zoomOut}
        icon={<ZoomMinus />}
      />
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={resetView}
        icon={<Zoom1 />}
      />
      <Button
        variant="tertiary"
        color="neutral"
        size="small"
        onClick={zoomIn}
        icon={<ZoomPlus />}
      />
    </div>
  );
};
