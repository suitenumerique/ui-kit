import React from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import {
  LaGaufreV2,
  LaGaufreV2Props,
} from "../../src/components/la-gaufre/LaGaufreV2";

export type ButtonViewportPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const viewportStyles: Record<ButtonViewportPosition, React.CSSProperties> = {
  "top-left": { position: "fixed", top: 10, left: 10 },
  "top-right": { position: "fixed", top: 10, right: 10 },
  "bottom-left": { position: "fixed", bottom: 10, left: 10 },
  "bottom-right": { position: "fixed", bottom: 10, right: 10 },
};

export type TestLaGaufreV2Props = LaGaufreV2Props & {
  buttonViewportPosition?: ButtonViewportPosition;
};

export const TestLaGaufreV2 = ({
  buttonViewportPosition,
  ...props
}: TestLaGaufreV2Props) => {
  const wrapperStyle = buttonViewportPosition
    ? viewportStyles[buttonViewportPosition]
    : undefined;
  return (
    <CunninghamProvider currentLocale="en-US">
      <div style={wrapperStyle}>
        <LaGaufreV2 {...props} />
      </div>
    </CunninghamProvider>
  );
};
