import { useEffect } from "react";
import { scrollToRef } from "../utils/scrollTo";

/** Scroll target into view when `active` becomes true */
export function useScrollIntoView(ref, active, options) {
  useEffect(() => {
    if (active) scrollToRef(ref, options);
  }, [active, ref, options]);
}
