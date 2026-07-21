import { useEffect, useState } from "react";
import config from "../../cunningham";

type ResponsiveStates = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

type Breakpoints = {
  mobile: number;
  tablet: number;
};

const breakpoints = {
  mobile: parseInt(
    config.themes.default.globals.breakpoints.mobile.replace("px", "")
  ),
  tablet: parseInt(
    config.themes.default.globals.breakpoints.tablet.replace("px", "")
  ),
};

const getResponsiveStates = (
  width: number,
  breakpoints: Breakpoints
): ResponsiveStates => {
  return {
    isMobile: width <= breakpoints.mobile,
    isTablet: width <= breakpoints.tablet,
    isDesktop: width > breakpoints.tablet,
  };
};

export const useResponsive = () => {
  const [responsiveStates, setResponsiveStates] = useState<ResponsiveStates>(
    getResponsiveStates(window.innerWidth, breakpoints)
  );

  // Memoize breakpoints to avoid recalculation on every render
  useEffect(() => {
    const handleResize = () => {
      const newResponsiveState = getResponsiveStates(
        window.innerWidth,
        breakpoints
      );
      const isSame =
        JSON.stringify(newResponsiveState) === JSON.stringify(responsiveStates);
      if (!isSame) {
        setResponsiveStates(newResponsiveState);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [responsiveStates]);

  return responsiveStates;
};
