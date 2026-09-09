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

const defaultTheme = config.themes.default as {
  globals: { breakpoints: { mobile: string; tablet: string } };
};
const breakpoints = {
  mobile: parseInt(defaultTheme.globals.breakpoints.mobile.replace("px", "")),
  tablet: parseInt(defaultTheme.globals.breakpoints.tablet.replace("px", "")),
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

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let pending: boolean = false;

    const handleResize = () => {
      const newResponsiveState = getResponsiveStates(window.innerWidth, breakpoints);

      setResponsiveStates((oldResponsiveStates) => {
        const isSame = (
          Object.keys(oldResponsiveStates) as (keyof ResponsiveStates)[]
        ).every((key) => oldResponsiveStates[key] === newResponsiveState[key]);
        return isSame ? oldResponsiveStates : newResponsiveState;
      });
    };

    const throttledResizeHandler = () => {
      if (pending === true){
        return;
      } 

      pending = true;
      timeoutId = setTimeout(() => {
        pending = false;
        handleResize();
      }, 300);
    };

    window.addEventListener("resize", throttledResizeHandler);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", throttledResizeHandler);
    };
  }, []);

  return responsiveStates;
};
