import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import React from "react";
import { useOverlayPosition } from "react-aria";
import { beforeEach, expect, vi } from "vitest";
import { Select } from ":/components/forms/select/index";
import { CunninghamProvider } from ":/components/provider";
import { expectMenuToBeOpen } from ":/components/forms/select/test-utils";

// jsdom has no layout, so the max height computed by react-aria is always 0.
// Spy on the positioning hook to check the max height it is given instead.
vi.mock("react-aria", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-aria")>();
  return {
    ...actual,
    useOverlayPosition: vi.fn(actual.useOverlayPosition),
  };
});

const OPTIONS = [{ label: "Paris" }, { label: "Panama" }, { label: "London" }];

const openMenu = async () => {
  const user = userEvent.setup();
  await user.click(screen.getByRole("combobox", { name: "City" }));
  expectMenuToBeOpen(screen.getByRole("listbox", { name: "City" }));
};

describe("<SelectMenu/>", () => {
  beforeEach(() => {
    vi.mocked(useOverlayPosition).mockClear();
  });

  it("caps the menu height to 160px by default", async () => {
    render(
      <CunninghamProvider>
        <Select label="City" options={OPTIONS} />
      </CunninghamProvider>,
    );
    await openMenu();
    expect(useOverlayPosition).toHaveBeenLastCalledWith(
      expect.objectContaining({ isOpen: true, maxHeight: 160 }),
    );
  });

  it.each([
    { multi: false, searchable: false },
    { multi: false, searchable: true },
    { multi: true, searchable: false },
    { multi: true, searchable: true },
  ])(
    "caps the menu height to menuMaxHeight (multi: $multi, searchable: $searchable)",
    async ({ multi, searchable }) => {
      render(
        <CunninghamProvider>
          <Select
            label="City"
            options={OPTIONS}
            multi={multi}
            searchable={searchable}
            menuMaxHeight={320}
          />
        </CunninghamProvider>,
      );
      await openMenu();
      expect(useOverlayPosition).toHaveBeenLastCalledWith(
        expect.objectContaining({ isOpen: true, maxHeight: 320 }),
      );
    },
  );
});
