import { useEffect, useRef } from "react";

type PendingAction = { id: string; index: number };

export const ACCESS_REQUEST_ACTION_CLASS =
  "c__share-access-request-item__action";

/**
 * After the app removes the acted-on request, moves focus to the next
 * request, else the previous one, else `onEmptied`, but only if focus was
 * lost with that row.
 */
export const useAccessRequestFocus = (
  requests: { id: string }[],
  onEmptied: () => void,
) => {
  const listRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<PendingAction | null>(null);
  const onEmptiedRef = useRef(onEmptied);

  useEffect(() => {
    onEmptiedRef.current = onEmptied;
  });

  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending || requests.some((request) => request.id === pending.id)) {
      return;
    }
    pendingRef.current = null;
    const active = document.activeElement;
    if (active && active !== document.body && active.isConnected) return;
    if (requests.length === 0) {
      onEmptiedRef.current();
      return;
    }
    const index = Math.min(pending.index, requests.length - 1);
    const actions = listRef.current?.querySelectorAll<HTMLElement>(
      `.${ACCESS_REQUEST_ACTION_CLASS}`,
    );
    actions?.[index]?.focus();
  }, [requests]);

  const track = (id: string) => {
    pendingRef.current = {
      id,
      index: requests.findIndex((request) => request.id === id),
    };
  };

  return { listRef, track };
};
