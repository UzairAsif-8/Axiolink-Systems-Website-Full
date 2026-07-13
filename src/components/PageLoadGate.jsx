import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { usePageLoad } from "../context/PageLoadContext";
import { waitForPageReady } from "../utils/waitForPageReady";

const PageLoadGate = ({ children }) => {
  const { markPageReady } = usePageLoad();
  const location = useLocation();
  const rootRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      await waitForPageReady(rootRef.current);
      if (!cancelled) markPageReady();
    })();

    return () => {
      cancelled = true;
    };
  }, [location.key, markPageReady]);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
};

export default PageLoadGate;
