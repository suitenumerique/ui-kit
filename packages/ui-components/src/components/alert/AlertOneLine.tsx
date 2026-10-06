import React from "react";
import { AlertProps } from ":/components/alert/index";
import { AlertWrapper, useAlertContentProps } from ":/components/alert/Utils";
import { NotificationContent } from ":/components/notification/NotificationContent";

export const AlertOneLine = (props: AlertProps) => {
  const contentProps = useAlertContentProps(props);
  return (
    <AlertWrapper {...props}>
      <NotificationContent {...contentProps}>
        {props.children}
      </NotificationContent>
    </AlertWrapper>
  );
};
