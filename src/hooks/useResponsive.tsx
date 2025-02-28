import { useEffect, useState } from "react";
import config from "../../cunningham";

export const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= config.themes.default.theme.breakpoints.mobile;
  const isTablet = width <= config.themes.default.theme.breakpoints.tablet;
  const isDesktop = width > config.themes.default.theme.breakpoints.tablet;

  return { isMobile, isTablet, isDesktop };
};
