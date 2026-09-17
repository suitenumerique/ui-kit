import React from "react";
import { AlertProps } from ":/components/alert/index";
import {
  alertActionProps,
  alertContentProps,
  AlertWrapper,
} from ":/components/alert/Utils";
import { NotificationContent } from ":/components/notification/NotificationContent";

export const AlertOneLine = (props: AlertProps) => {
  return (
    <AlertWrapper {...props}>
      <NotificationContent
        {...alertContentProps(props)}
        {...alertActionProps(props)}
      >
        {props.children}
      </NotificationContent>
    </AlertWrapper>
  );
};
