import { useEffect } from "react";

/**
 * useArrowRoving
 *
 * Hook to manage keyboard navigation with ArrowLeft / ArrowRight inside a toolbar of actions.
 * - ArrowLeft / ArrowRight → move focus between buttons in the same container (roving focus).
 * - Enter → still activate the focused button normally, except right after roving
 *   where the hook suppresses the "phantom click" (to avoid triggering actions by mistake).
 *
 * Usage:
 *   const actionsRef = useRef<HTMLDivElement | null>(null);
 *   useArrowRoving(actionsRef.current);
 *
 *   return (
 *     <div ref={actionsRef}>
 *       <button>Option 1</button>
 *       <button>Option 2</button>
 *     </div>
 *   );
 */

export function useArrowRoving(container: HTMLElement | null): void {
  useEffect(() => {
    if (!container) return;

    let blockNextActivate = false;

    const getButtons = (): HTMLButtonElement[] =>
      Array.from(container.querySelectorAll("button")).filter(
        (btn): btn is HTMLButtonElement =>
          !btn.disabled && btn.getAttribute("aria-disabled") !== "true"
      );

    const onKeyDown = (e: KeyboardEvent): void => {
      const isArrowKey = e.key === "ArrowLeft" || e.key === "ArrowRight";
      const isActivationKey = e.key === " ";
      const isHTMLElementTarget = e.target instanceof HTMLElement;
      if (!isHTMLElementTarget) return;

      if (isActivationKey) {
        const btn = e.target.closest("button");
        const isValidButton =
          btn instanceof HTMLButtonElement && container.contains(btn);
        if (isValidButton) {
          btn.click();
        }
        return;
      }

      if (!isArrowKey) return;

      const btn = e.target.closest("button");
      const isValidButton =
        btn instanceof HTMLButtonElement && container.contains(btn);
      if (!isValidButton) return;

      const buttons = getButtons();
      const buttonIndex = buttons.indexOf(btn as HTMLButtonElement);
      if (buttonIndex < 0) return;

      e.preventDefault();
      e.stopPropagation();

      const nextButtonIndex =
        e.key === "ArrowRight"
          ? (buttonIndex + 1) % buttons.length
          : (buttonIndex - 1 + buttons.length) % buttons.length;

      buttons[nextButtonIndex].focus();
      blockNextActivate = true;
    };

    // Prevents accidental click when pressing Enter/Space right after roving
    const onKeyUp = (e: KeyboardEvent): void => {
      if (!blockNextActivate) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
      blockNextActivate = false;
    };

    // Intercept events before they bubble
    const options: AddEventListenerOptions = { capture: true };
    container.addEventListener("keydown", onKeyDown, options);
    container.addEventListener("keyup", onKeyUp, options);

    return () => {
      container.removeEventListener("keydown", onKeyDown, options);
      container.removeEventListener("keyup", onKeyUp, options);
    };
  }, [container]);
}
