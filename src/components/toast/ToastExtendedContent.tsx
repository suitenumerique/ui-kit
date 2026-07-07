import { useState } from "react";
import { FileIcon } from ":/components/preview/icons/FileIcon";
import { CircleCheckFilled } from "../icon/icons/CircleCheckFilled";
import { Loader } from "../icon/icons/Loader";
import { Info } from "../icon/icons/Info";
import { ChevronDown } from "../icon/icons/ChevronDown";
import { XMark } from "../icon/icons/XMark";
import { ToastExtendedItem, ToastExtendedOptions } from "./types";

type ToastExtendedContentProps = Omit<
  ToastExtendedOptions,
  "autoClose" | "containerId"
>;

const ToastExtendedItemRow = ({ item }: { item: ToastExtendedItem }) => {
  return (
    <li className="c__toast-extended__item">
      <span className="c__toast-extended__item-icon">
        {item.icon ?? (
          <FileIcon
            file={{ title: item.title, mimetype: item.mimetype ?? "" }}
            type="mini"
            size={24}
          />
        )}
      </span>
      <span className="c__toast-extended__item-content">
        <span className="c__toast-extended__item-title">{item.title}</span>
        {item.size && (
          <span className="c__toast-extended__item-size">{item.size}</span>
        )}
      </span>
      <span className="c__toast-extended__item-status">
        {item.status === "completed" ? (
          <CircleCheckFilled size={16} />
        ) : (
          <Loader size={16} className="c__toast-extended__item-loader" />
        )}
      </span>
    </li>
  );
};

export const ToastExtendedContent = ({
  items,
  summary,
  progress,
  onClose,
  onInfoClick,
}: ToastExtendedContentProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="c__toast-extended">
      {expanded && (
        <ul className="c__toast-extended__list">
          {items.map((item) => (
            <ToastExtendedItemRow key={item.id ?? item.title} item={item} />
          ))}
        </ul>
      )}
      <div className="c__toast-extended__footer">
        <div className="c__toast-extended__summary">
          <span className="c__toast-extended__summary-text">{summary}</span>
          {progress !== undefined && (
            <span className="c__toast-extended__summary-progress">
              {progress}%
            </span>
          )}
          <button
            type="button"
            className="c__toast-extended__summary-info"
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick?.();
            }}
            aria-label="More information"
          >
            <Info size={16} />
          </button>
        </div>
        <div className="c__toast-extended__footer-actions">
          <button
            type="button"
            className="c__toast-extended__footer-action c__toast-extended__footer-action--toggle"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
          >
            <ChevronDown size={16} />
          </button>
          <button
            type="button"
            className="c__toast-extended__footer-action"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Close"
          >
            <XMark size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
