import React from "react";
import { useControllableState } from ":/hooks/useControllableState";
import { Button } from ":/components/button";
import { AlertProps } from ":/components/alert/index";
import { AlertAdditional } from ":/components/alert/AlertAdditional";
import { AlertOneLine } from ":/components/alert/AlertOneLine";
import { useCunningham } from ":/components/provider";

export const AlertAdditionalExpandable = (props: AlertProps) => {
  const { t } = useCunningham();
  const [expanded, onExpand] = useControllableState(
    false,
    props.expanded,
    props.onExpand,
  );

  const iconButton = (
    <Button
      color={props.type}
      variant="tertiary"
      size="nano"
      aria-label={
        expanded
          ? t("components.alert.shrink_aria_label")
          : t("components.alert.expand_aria_label")
      }
      icon={
        <span className="material-icons">{expanded ? "remove" : "add"}</span>
      }
      onClick={() => {
        onExpand(!expanded);
      }}
    />
  );

  const customProps = {
    ...props,
    icon: iconButton,
    className: "c__alert--expandable",
  };

  if (expanded) {
    return <AlertAdditional {...customProps} />;
  }
  return <AlertOneLine {...customProps} />;
};
