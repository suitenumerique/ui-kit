type SpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
};

export const Spinner = ({ size = "sm" }: SpinnerProps) => {
  return <div className={["c__spinner", size].join(" ")} />;
};
