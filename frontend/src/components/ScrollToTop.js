import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const handlePopState = () => {
      prevPathname.current = window.location.pathname;
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      window.scrollTo(0, 0);
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
