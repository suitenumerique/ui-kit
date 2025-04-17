import clsx from "clsx";
import { HTMLAttributes, PropsWithChildren } from "react";
import { BadgeType } from "./types";

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
    uppercased?: boolean;
    type?: BadgeType;
}

const Badge = ({ children, uppercased = false, type = "accent", className, ...props }: PropsWithChildren<BadgeProps>) => {
    return (
        <div className={clsx(className, "c__badge", {
            "c__badge--uppercased": uppercased,
            [`c__badge--${type}`]: type,
        })} {...props}>
            {children}
        </div>
    );
};

export default Badge;
  