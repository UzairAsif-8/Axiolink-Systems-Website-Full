import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      // Handle URLs like /about#team
      const id = hash.substring(1);

      const timer = setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }

    // Scroll to top on every page change
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;