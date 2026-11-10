import { render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import {
  Button,
  GridList,
  GridListItem,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  Popover,
  Select,
  TextField,
} from "react-aria-components";
import { vi } from "vitest";
import { CunninghamProvider } from ":/components/provider";
import { MenuItemBody } from "./MenuItemBody";

const Wrapper = ({ children }: PropsWithChildren) => (
  <CunninghamProvider>{children}</CunninghamProvider>
);

describe("<MenuItemBody /> text slots (withSlots)", () => {
  it("names a menu item by its label and describes it by the sub text and shortcut, by default", () => {
    render(
      <Menu aria-label="Actions">
        <MenuItem textValue="Duplicate">
          <MenuItemBody label="Duplicate" subText="Make a copy" shortcut="⌘D" />
        </MenuItem>
      </Menu>,
      { wrapper: Wrapper },
    );

    const item = screen.getByRole("menuitem");
    expect(item).toHaveAccessibleName("Duplicate");
    expect(item).toHaveAccessibleDescription("Make a copy ⌘D");
  });

  it("names a listbox option by its label and describes it by the sub text, by default", () => {
    render(
      <ListBox aria-label="Roles">
        <ListBoxItem textValue="Reader">
          <MenuItemBody label="Reader" subText="Can view" />
        </ListBoxItem>
      </ListBox>,
      { wrapper: Wrapper },
    );

    const option = screen.getByRole("option");
    expect(option).toHaveAccessibleName("Reader");
    expect(option).toHaveAccessibleDescription("Can view");
  });

  it("leaves the whole text in the name with withSlots={false}", () => {
    render(
      <Menu aria-label="Actions">
        <MenuItem textValue="Duplicate">
          <MenuItemBody
            withSlots={false}
            label="Duplicate"
            subText="Make a copy"
          />
        </MenuItem>
      </Menu>,
      { wrapper: Wrapper },
    );

    const item = screen.getByRole("menuitem");
    expect(item).toHaveAccessibleName("Duplicate Make a copy");
    expect(item).toHaveAccessibleDescription("");
  });

  it("renders as plain text outside any React Aria component", () => {
    render(
      <button type="button">
        <MenuItemBody label="Reset" subText="Clear the filter" />
      </button>,
      { wrapper: Wrapper },
    );

    expect(screen.getByRole("button")).toHaveAccessibleName(
      "Reset Clear the filter",
    );
  });

  it("renders in the popover of a Select, which clears the field text slots", () => {
    render(
      <Select aria-label="Sort" isOpen>
        <Button>Sort</Button>
        <Popover>
          <button type="button">
            <MenuItemBody label="Reset" />
          </button>
        </Popover>
      </Select>,
      { wrapper: Wrapper },
    );

    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("throws in a grid list item, whose text slots have no label, unless withSlots={false}", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() =>
      render(
        <GridList aria-label="Files">
          <GridListItem textValue="Report">
            <MenuItemBody label="Report" />
          </GridListItem>
        </GridList>,
        { wrapper: Wrapper },
      ),
    ).toThrow('Invalid slot "label"');
    consoleError.mockRestore();

    render(
      <GridList aria-label="Files">
        <GridListItem textValue="Report">
          <MenuItemBody withSlots={false} label="Report" />
        </GridListItem>
      </GridList>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  it("throws in a React Aria field whose text slots have no label, unless withSlots={false}", () => {
    // React reports the error thrown while rendering.
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() =>
      render(
        <TextField aria-label="Search">
          <MenuItemBody label="Reset" />
        </TextField>,
        { wrapper: Wrapper },
      ),
    ).toThrow('Invalid slot "label"');
    consoleError.mockRestore();

    render(
      <TextField aria-label="Search">
        <MenuItemBody withSlots={false} label="Reset" />
      </TextField>,
      { wrapper: Wrapper },
    );
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });
});
