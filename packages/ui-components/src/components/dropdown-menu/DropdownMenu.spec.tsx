import { render, screen } from "@testing-library/react";
import { CunninghamProvider } from ":/components/provider";
import { Button } from ":/components/button";
import { DropdownMenu } from "./DropdownMenu";

describe("<DropdownMenu />", () => {
  it("names a menu item from its JSX label text", async () => {
    render(
      <CunninghamProvider>
        <DropdownMenu
          isOpen
          options={[
            {
              id: "present",
              // Labels are typed as strings, but callers pass JSX at runtime.
              label: (
                <>
                  <span>Present</span>
                  <kbd>Ctrl+P</kbd>
                </>
              ) as unknown as string,
            },
          ]}
        >
          <Button>Open</Button>
        </DropdownMenu>
      </CunninghamProvider>,
    );

    const item = await screen.findByRole("menuitem", { name: /Present/ });
    expect(item).toHaveAccessibleName(/Present/);
    expect(item).not.toHaveAccessibleName("[object Object]");
    expect(item).not.toHaveAttribute("aria-label");
  });

  it("keeps the new-window suffix on a string label", async () => {
    render(
      <CunninghamProvider>
        <DropdownMenu
          isOpen
          options={[{ id: "docs", label: "Docs", opensInNewWindow: true }]}
        >
          <Button>Open</Button>
        </DropdownMenu>
      </CunninghamProvider>,
    );

    const item = await screen.findByRole("menuitem", {
      name: "Docs (new window)",
    });
    expect(item).toHaveAttribute("aria-label", "Docs (new window)");
  });
});
