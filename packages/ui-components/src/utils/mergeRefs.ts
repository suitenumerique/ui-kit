import { Ref, RefCallback, RefObject } from "react";

/** Combines refs so one element can be handed to several owners. */
export const mergeRefs =
  <T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> =>
  (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        (ref as RefObject<T | null>).current = value;
      }
    }
  };
