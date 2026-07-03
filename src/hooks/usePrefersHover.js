import { useEffect, useState } from "react";

/** True when the primary input supports hover (mouse/trackpad), not touch-only. */
export function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setPrefersHover(mq.matches);
    const onChange = (e) => setPrefersHover(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return prefersHover;
}
