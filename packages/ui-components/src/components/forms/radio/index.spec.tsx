import userEvent from "@testing-library/user-event";
import React from "react";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";
import {
  Radio,
  RadioGroup,
  RadioOnlyProps,
} from ":/components/forms/radio/index";
import { FieldProps } from "../field";

const spyError = vi.spyOn(global.console, "error");

describe("<Radio/>", () => {
  afterAll(() => {
    spyError.mockRestore();
  });

  it("should render", async () => {
    render(<Radio label="Yes" />);
    expect(screen.getByLabelText("Yes")).toBeInTheDocument();
  });
  it("should render checked", async () => {
    render(<Radio label="Yes" defaultChecked={true} />);
    const input: HTMLInputElement = screen.getByRole("radio", {
      name: "Yes",
    });
    expect(input.checked).toEqual(true);
  });
  it("should render disabled", async () => {
    render(<Radio label="Yes" disabled={true} />);
    expect(screen.getByRole("radio", { name: "Yes" })).toBeDisabled();
    // Click and expect the radio does not get checked
    const user = userEvent.setup();
    const input: HTMLInputElement = screen.getByRole("radio", {
      name: "Yes",
    });
    expect(input.checked).toEqual(false);
    await user.click(input);
    expect(input.checked).toEqual(false);
  });
  it("describes the radio with its text, so screen readers read the error", () => {
    render(<Radio label="Yes" state="error" text="Pick an answer." />);
    // Named after its label only: the message is not read twice.
    const input = screen.getByRole("radio", { name: "Yes" });
    expect(input).toHaveAccessibleDescription("Pick an answer.");
  });

  it("has no description when there is no text", () => {
    render(<Radio label="Yes" />);
    const input = screen.getByRole("radio", { name: "Yes" });
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("keeps the name and description given by the consumer", () => {
    render(
      <>
        <span id="hint">Hint</span>
        <Radio
          label="Yes"
          aria-label="Custom name"
          aria-describedby="hint"
          text="Pick an answer."
        />
      </>,
    );
    const input = screen.getByRole("radio", { name: "Custom name" });
    expect(input).toHaveAccessibleDescription("Hint Pick an answer.");
  });

  it("should render with text", async () => {
    render(<Radio label="Yes" text="Text" />);
    expect(screen.getByText("Text")).toBeInTheDocument();
  });
  it("should render with state=success", async () => {
    render(<Radio label="Yes" state="success" text="Success text" />);
    expect(screen.getByText("Success text")).toBeInTheDocument();
    expect(
      document.querySelector(".c__field.c__field--success"),
    ).toBeInTheDocument();
  });
  it("should render with state=error", async () => {
    render(<Radio label="Yes" state="error" text="Error text" />);
    expect(screen.getByText("Error text")).toBeInTheDocument();
    expect(
      document.querySelector(".c__field.c__field--error"),
    ).toBeInTheDocument();
  });
  it("should render with group", async () => {
    render(
      <RadioGroup>
        <Radio label="Yes" />
        <Radio label="No" />
      </RadioGroup>,
    );
    screen.getByRole("radio", {
      name: "Yes",
    });
    screen.getByRole("radio", {
      name: "No",
    });
  });
  it("should render with group and checking one radio should unchecked all others", async () => {
    render(
      <RadioGroup>
        <Radio name="agree" label="Yes" />
        <Radio name="agree" label="No" />
      </RadioGroup>,
    );
    const user = userEvent.setup();
    const yesInput: HTMLInputElement = screen.getByLabelText("Yes");
    const noInput: HTMLInputElement = screen.getByLabelText("No");
    expect(yesInput.checked).toEqual(false);
    expect(noInput.checked).toEqual(false);
    await user.click(yesInput);
    expect(yesInput.checked).toEqual(true);
    expect(noInput.checked).toEqual(false);
    await user.click(noInput);
    expect(yesInput.checked).toEqual(false);
    expect(noInput.checked).toEqual(true);
  });
  it("names the group after its title and describes it with its text", () => {
    render(
      <>
        <div id="offices-title">Your office</div>
        <RadioGroup
          aria-labelledby="offices-title"
          state="error"
          text="Pick an office."
        >
          <Radio label="Paris" name="office" />
          <Radio label="Dublin" name="office" />
        </RadioGroup>
      </>,
    );
    const group = screen.getByRole("radiogroup", { name: "Your office" });
    expect(group).toHaveAccessibleDescription("Pick an office.");
  });

  it("accepts an aria-label as the group name", () => {
    render(
      <RadioGroup aria-label="Your office">
        <Radio label="Paris" name="office" />
      </RadioGroup>,
    );
    expect(
      screen.getByRole("radiogroup", { name: "Your office" }),
    ).toBeInTheDocument();
  });

  it("keeps the given aria-describedby before the group text", () => {
    render(
      <>
        <span id="offices-hint">Hint</span>
        <RadioGroup
          aria-label="Your office"
          aria-describedby="offices-hint"
          text="Pick an office."
        >
          <Radio label="Paris" name="office" />
        </RadioGroup>
      </>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAccessibleDescription(
      "Hint Pick an office.",
    );
  });

  it("has no group description when there is no text", () => {
    render(
      <RadioGroup aria-label="Your office">
        <Radio label="Paris" name="office" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("should render with group text", async () => {
    render(
      <RadioGroup text="Text">
        <Radio label="Yes" />
        <Radio label="No" />
      </RadioGroup>,
    );
    expect(screen.getByText("Text")).toBeInTheDocument();
  });
  it("should render with group state=success", async () => {
    render(
      <RadioGroup state="success" text="Success text">
        <Radio label="Yes" />
        <Radio label="No" />
      </RadioGroup>,
    );
    expect(screen.getByText("Success text")).toBeInTheDocument();
    expect(
      document.querySelector(".c__radio__group.c__field.c__field--success"),
    ).toBeInTheDocument();
  });
  it("should render with group state=error", async () => {
    render(
      <RadioGroup state="error" text="Error text">
        <Radio label="Yes" />
        <Radio label="No" />
      </RadioGroup>,
    );
    expect(screen.getByText("Error text")).toBeInTheDocument();
    expect(
      document.querySelector(".c__radio__group.c__field.c__field--error"),
    ).toBeInTheDocument();
  });

  it("checks the props doesn't create error warning", async () => {
    const propsInput: Required<FieldProps & RadioOnlyProps> = {
      label: "First name",
      fullWidth: true,
      className: "c__field--full-width",
      compact: false,
      state: "default",
      text: "my text",
      textItems: ["my text item 1", "my text item 2"],
      rightText: "my right text",
      disabled: false,
      labelWidth: "10rem",
    };

    render(<Radio {...propsInput} />);
    expect(spyError).not.toHaveBeenCalled();
  });

  it("renders with className", async () => {
    render(
      <Radio
        label="Agree"
        checked={true}
        readOnly={true}
        className="my-custom-class"
      />,
    );
    expect(
      document.querySelector(".c__checkbox.my-custom-class"),
    ).toBeInTheDocument();
  });
  it("renders group with className", async () => {
    render(<RadioGroup className="my-custom-class" />);
    expect(
      document.querySelector(".c__checkbox__group.my-custom-class"),
    ).toBeInTheDocument();
  });
});
