/**
 * Descriptor for the borderless buttons that `Alert` and `Toast` render in
 * their action row.
 */
export type NotificationAction = {
  label: string;
  onClick: () => void;
};
