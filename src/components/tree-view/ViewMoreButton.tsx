import React, { useState } from "react";

export type ViewMoreButtonProps = {
  onLoadMore: () => Promise<void>;
  isLoading?: boolean;
  className?: string;
};

export const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({
  onLoadMore,
  isLoading = false,
  className = "",
}) => {
  const [isLoadingState, setIsLoadingState] = useState(false);

  const handleClick = async () => {
    if (isLoading || isLoadingState) return;

    setIsLoadingState(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error("Error loading more children:", error);
    } finally {
      setIsLoadingState(false);
    }
  };

  const isCurrentlyLoading = isLoading || isLoadingState;

  return (
    <div className={`c__tree-view--view-more ${className}`}>
      <button
        onClick={handleClick}
        disabled={isCurrentlyLoading}
        className="c__tree-view--view-more-button"
        type="button"
      >
        {isCurrentlyLoading ? (
          <span className="c__tree-view--view-more-loading">Chargement...</span>
        ) : (
          <span className="c__tree-view--view-more-text">Voir plus</span>
        )}
      </button>
    </div>
  );
};
