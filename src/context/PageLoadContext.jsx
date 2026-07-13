import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoadingOverlay from "../components/PageLoadingOverlay";

const PageLoadContext = createContext(null);

const OVERLAY_EXIT_MS = 320;
const OVERLAY_MAX_MS = 12000;

export const PageLoadProvider = ({ children }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const readyRef = useRef(false);
  const maxWaitTimerRef = useRef(null);

  const finishLoading = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    setExiting(true);
    window.setTimeout(() => setVisible(false), OVERLAY_EXIT_MS);
  }, []);

  useEffect(() => {
    readyRef.current = false;
    setVisible(true);
    setExiting(false);

    maxWaitTimerRef.current = window.setTimeout(finishLoading, OVERLAY_MAX_MS);

    return () => {
      if (maxWaitTimerRef.current) {
        window.clearTimeout(maxWaitTimerRef.current);
      }
    };
  }, [location.key, finishLoading]);

  const markPageReady = useCallback(() => {
    if (maxWaitTimerRef.current) {
      window.clearTimeout(maxWaitTimerRef.current);
      maxWaitTimerRef.current = null;
    }
    finishLoading();
  }, [finishLoading]);

  return (
    <PageLoadContext.Provider value={{ markPageReady }}>
      {children}
      {visible ? <PageLoadingOverlay exiting={exiting} /> : null}
    </PageLoadContext.Provider>
  );
};

export const usePageLoad = () => {
  const context = useContext(PageLoadContext);
  if (!context) {
    throw new Error("usePageLoad must be used within PageLoadProvider");
  }
  return context;
};
