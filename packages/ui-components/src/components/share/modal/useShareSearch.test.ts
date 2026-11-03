import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useShareSearch } from "./useShareSearch";

const user = { id: "1", full_name: "Alice", email: "alice@example.com" };

describe("useShareSearch lifecycle", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("cancels a queued query when an existing result is selected", () => {
    const onSearchUsers = vi.fn();
    const { result } = renderHook(() =>
      useShareSearch({ onSearchUsers, initialRole: "reader" }),
    );
    act(() => result.current.changeInput("ali"));
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current.changeInput("alice"));
    act(() => result.current.selectUser(user));
    act(() => vi.advanceTimersByTime(300));

    expect(onSearchUsers.mock.calls).toEqual([["ali"], [""]]);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.inputValue).toBe("");
    expect(result.current.selectedUsers).toEqual([user]);
    expect(result.current.isSearching).toBe(true);
  });

  it("cancels a queued search on unmount", () => {
    const onSearchUsers = vi.fn();
    const { result, unmount } = renderHook(() =>
      useShareSearch({ onSearchUsers, initialRole: "reader" }),
    );
    act(() => result.current.changeInput("alice"));
    unmount();
    act(() => vi.advanceTimersByTime(300));
    expect(onSearchUsers).not.toHaveBeenCalled();
  });

  it("clearing cancels a queued search and immediately restores browsing", () => {
    const onSearchUsers = vi.fn();
    const { result } = renderHook(() =>
      useShareSearch({ onSearchUsers, initialRole: "reader" }),
    );
    act(() => result.current.changeInput("alice"));
    act(() => result.current.changeInput(""));
    act(() => vi.advanceTimersByTime(300));
    expect(onSearchUsers.mock.calls).toEqual([[""]]);
    expect(result.current.isSearching).toBe(false);
  });

  it("keeps the selection if an optional invitation callback is absent", () => {
    const { result } = renderHook(() =>
      useShareSearch({ initialRole: "reader" }),
    );
    act(() => result.current.selectUser(user));
    act(() => result.current.share());
    expect(result.current.selectedUsers).toEqual([user]);
  });
});

describe("useShareSearch selection", () => {
  it("keeps one chip when the same user is selected again", () => {
    const { result } = renderHook(() =>
      useShareSearch({ initialRole: "reader" }),
    );
    act(() => result.current.selectUser(user));
    act(() => result.current.selectUser({ ...user }));
    act(() =>
      result.current.selectUser({
        id: "ALICE@example.com",
        full_name: "",
        email: "ALICE@example.com",
      }),
    );
    expect(result.current.selectedUsers).toEqual([user]);
    expect(result.current.inputValue).toBe("");
  });

  it("keeps distinct users that have no email", () => {
    const { result } = renderHook(() =>
      useShareSearch({ initialRole: "reader" }),
    );
    const first = { id: "1", full_name: "First", email: "" };
    const second = { id: "2", full_name: "Second", email: "" };
    act(() => result.current.selectUser(first));
    act(() => result.current.selectUser(second));
    expect(result.current.selectedUsers).toEqual([first, second]);
  });
});
