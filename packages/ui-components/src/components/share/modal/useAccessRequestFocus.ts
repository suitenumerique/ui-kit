import { useEffect, useRef } from "react";

type PendingAction = { id: string; index: number; ids: string[] };

export const ACCESS_REQUEST_ACTION_CLASS =
  "c__share-access-request-item__action";

const isSameList = (left: string[], right: string[]) =>
  left.length === right.length &&
  left.every((id, index) => id === right[index]);

/**
 * Moves focus after the app removes an acted-on access request: to the next
 * request, else the previous one, else through `onEmptied`.
 */
export const useAccessRequestFocus = (
  requests: { id: string }[],
  onEmptied: () => void,
) => {
  const listRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<PendingAction | null>(null);
  const onEmptiedRef = useRef(onEmptied);

  // `onEmptied` is recreated on every render, so it stays out of the
  // dependencies of the effect below.
  useEffect(() => {
    onEmptiedRef.current = onEmptied;
  });

  useEffect(() => {
    const pending = pendingRef.current;
    const ids = requests.map((request) => request.id);
    if (!pending || isSameList(ids, pending.ids)) return;
    pendingRef.current = null;
    if (ids.includes(pending.id)) return;
    if (ids.length === 0) {
      onEmptiedRef.current();
      return;
    }
    const index = Math.min(pending.index, ids.length - 1);
    const actions = listRef.current?.querySelectorAll<HTMLElement>(
      `.${ACCESS_REQUEST_ACTION_CLASS}`,
    );
    actions?.[index]?.focus();
  }, [requests]);

  const track = (id: string) => {
    const ids = requests.map((request) => request.id);
    pendingRef.current = { id, index: ids.indexOf(id), ids };
  };

  return { listRef, track };
};
