import classNames from "classnames";

export interface ProgressBarProps {
  /**
   * Completion, from 0 to 100. Values outside the range are clamped. Leave it
   * out to get the indeterminate animation, for a task whose length is not
   * known yet.
   */
  value?: number;
  className?: string;
  /**
   * Describes what is progressing. Required for the bar to make sense to a
   * screen reader, unless a visible label is already wired through
   * `aria-labelledby`.
   */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export const ProgressBar = ({
  value,
  className,
  ...props
}: ProgressBarProps) => {
  const indeterminate = value === undefined;
  const percentage = indeterminate ? undefined : clamp(value);

  return (
    <div
      className={classNames(
        "c__progress-bar",
        { "c__progress-bar--indeterminate": indeterminate },
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      // Omitted on purpose when indeterminate: that is what tells assistive
      // technologies the completion is unknown.
      aria-valuenow={percentage}
      {...props}
    >
      <div
        className="c__progress-bar__fill"
        style={indeterminate ? undefined : { width: `${percentage}%` }}
      />
    </div>
  );
};
