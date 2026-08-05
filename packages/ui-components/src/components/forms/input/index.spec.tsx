import { render, screen, waitFor } from "@testing-library/react";
import React, { useRef } from "react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import { Input, InputOnlyProps } from ":/components/forms/input/index";
import { Button } from ":/components/button";
import { InputPassword } from ":/components/forms/input/InputPassword";
import { CunninghamProvider } from ":/components/provider";
import { FieldProps } from "../field";

const spyError = vi.spyOn(global.console, "error");

describe("<Input/>", () => {
  afterAll(() => {
    spyError.mockRestore();
  });

  it("renders and can type", async () => {
    const user = userEvent.setup();
    render(<Input label="First name" />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    expect(input.value).toEqual("");
    await user.type(input, "John");
    expect(input.value).toEqual("John");
  });
  it("renders with default value and can type", async () => {
    const user = userEvent.setup();
    render(<Input label="First name" defaultValue="John" />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });

    expect(input.value).toEqual("John");
    await user.clear(input);
    expect(input.value).toEqual("");
    await user.type(input, "Paul");
    expect(input.value).toEqual("Paul");
  });
  it("renders with moving label", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Input label="First name" />
        <Input label="Second name" />
      </div>,
    );

    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    const input2: HTMLInputElement = screen.getByRole("textbox", {
      name: "Second name",
    });
    const label = screen.getByText("First name")!.parentElement!;
    expect(Array.from(label.classList)).toContain("placeholder");

    // Clicking on the input should remove the placeholder class.
    await user.click(input);

    expect(Array.from(label.classList)).not.toContain("placeholder");

    // Writing something should remove the placeholder class too.
    await user.type(input, "John");

    expect(Array.from(label.classList)).not.toContain("placeholder");

    // Clearing the input and focus out should add the placeholder class
    await user.clear(input);
    await user.click(input2);

    expect(Array.from(label.classList)).toContain("placeholder");
  });
  it("renders with state=success", async () => {
    render(<Input label="First name" state="success" />);
    expect(document.querySelector(".c__field--success")).toBeInTheDocument();
    expect(
      document.querySelector(".c__input__wrapper--success"),
    ).toBeInTheDocument();
  });
  it("renders with state=error", async () => {
    render(<Input label="First name" state="error" />);
    expect(document.querySelector(".c__field--error")).toBeInTheDocument();
    expect(
      document.querySelector(".c__input__wrapper--error"),
    ).toBeInTheDocument();
  });
  it("renders disabled", async () => {
    const user = userEvent.setup();
    render(<Input label="First name" disabled={true} />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    expect(
      document.querySelector(".c__input__wrapper--disabled"),
    ).toBeInTheDocument();
    expect(input.value).toEqual("");
    // Disabled inputs should not be able to type.
    await user.type(input, "John");
    expect(input.value).toEqual("");
  });
  it("renders with left icon", async () => {
    render(
      <Input
        label="First name"
        icon={<span className="material-icons">apartment</span>}
      />,
    );
    expect(document.querySelector(".material-icons")).toBeInTheDocument();
  });
  it("renders with right icon", async () => {
    render(
      <Input
        label="First name"
        rightIcon={<span className="material-icons">apartment</span>}
      />,
    );
    expect(document.querySelector(".material-icons")).toBeInTheDocument();
  });
  it("renders with text", async () => {
    render(
      <Input
        label="First name"
        rightIcon={<span className="material-icons">apartment</span>}
        text="Some text"
      />,
    );
    screen.getByText("Some text");
  });
  it("renders with text items", async () => {
    render(
      <Input
        label="First name"
        rightIcon={<span className="material-icons">apartment</span>}
        textItems={[
          "Text too long",
          "Wrong choice",
          "Must contain at least 9 characters, uppercase and digits",
        ]}
      />,
    );
    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([
      "Text too long",
      "Wrong choice",
      "Must contain at least 9 characters, uppercase and digits",
    ]);
  });
  it("renders with text and text right", async () => {
    render(
      <Input
        label="First name"
        rightIcon={<span className="material-icons">apartment</span>}
        rightText="Some text right"
      />,
    );
    screen.getByText("Some text right");
  });
  it("renders with char counter", async () => {
    const user = userEvent.setup();
    render(<Input label="First name" charCounter={true} charCounterMax={15} />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    screen.getByText("0/15");
    await user.type(input, "Jo");
    screen.getByText("2/15");
    await user.type(input, "hn");
    screen.getByText("4/15");
    await user.clear(input);
    screen.getByText("0/15");
  });
  it("forwards ref", async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const ref = useRef<HTMLInputElement>(null);
      return (
        <div>
          <Input label="First name" ref={ref} />
          <Button onClick={() => ref.current?.focus()}>Focus</Button>
        </div>
      );
    };
    render(<Wrapper />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    expect(input).not.toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Focus" }));
    waitFor(() => expect(input).toHaveFocus());
  });
  it("works controlled", async () => {
    const Wrapper = () => {
      const [value, setValue] = React.useState("I am controlled");
      return (
        <div>
          <div>Value: {value}.</div>
          <Input
            label="First name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={() => setValue("")}>Reset</Button>
        </div>
      );
    };
    const user = userEvent.setup();
    render(<Wrapper />);
    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: "First name",
    });
    screen.getByText("Value: I am controlled.");
    await user.type(input, "John");
    screen.getByText("Value: I am controlledJohn.");
    await user.clear(input);
    screen.getByText("Value: .");
  });

  it("checks the props doesn't create error warning", async () => {
    const propsInput: Required<FieldProps & InputOnlyProps> = {
      label: "First name",
      fullWidth: true,
      charCounter: true,
      charCounterMax: 15,
      className: "c__field--full-width",
      compact: false,
      state: "default",
      icon: "my icon",
      rightIcon: "my right icon",
      text: "my text",
      textItems: ["my text item 1", "my text item 2"],
      rightText: "my right text",
      disabled: false,
      variant: "floating",
      hideLabel: false,
      labelDescription: "my label description",
      labelWidth: "10rem",
    };

    render(<Input {...propsInput} />);
    expect(spyError).not.toHaveBeenCalled();
  });

  it("renders with className", async () => {
    render(<Input label="First name" className="my-custom-class" />);
    expect(
      document.querySelector(".c__field.my-custom-class"),
    ).toBeInTheDocument();
  });

  it("renders with className", async () => {
    render(<Input label="First name" className="my-custom-class" />);
    expect(
      document.querySelector(".c__field.my-custom-class"),
    ).toBeInTheDocument();
  });

  it("allows to show/hide password", async () => {
    render(
      <CunninghamProvider>
        <InputPassword label="Password" />
      </CunninghamProvider>,
    );
    const user = userEvent.setup();
    const input: HTMLInputElement = screen.getByLabelText("Password");

    await user.type(input, "azerty");
    expect(input.type).toEqual("password");

    let button = screen.getByRole("button", { name: "Show password" });
    await user.click(button);
    expect(input.type).toEqual("text");

    button = screen.getByRole("button", { name: "Hide password" });
    await user.click(button);
    expect(input.type).toEqual("password");
  });

  describe("classic variant", () => {
    it("renders with classic variant", () => {
      render(<Input label="First name" variant="classic" />);
      // In classic mode, label is rendered outside the wrapper with its own class
      expect(document.querySelector(".c__input__label")).toBeInTheDocument();
      expect(screen.getByText("First name")).toBeInTheDocument();
    });

    it("label is always static in classic variant", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Input label="First name" variant="classic" />
          <Input label="Second name" variant="classic" />
        </div>,
      );

      const input: HTMLInputElement = screen.getByRole("textbox", {
        name: "First name",
      });
      const label = screen.getByText("First name");

      // In classic variant, label is outside the wrapper and has c__input__label class
      expect(label.classList.contains("c__input__label")).toBe(true);

      // Focusing should not change anything
      await user.click(input);
      expect(label.classList.contains("c__input__label")).toBe(true);

      // Typing should not change anything
      await user.type(input, "John");
      expect(label.classList.contains("c__input__label")).toBe(true);
    });

    it("shows placeholder in classic variant", () => {
      render(
        <Input
          label="First name"
          variant="classic"
          placeholder="Enter your first name"
        />,
      );
      const input: HTMLInputElement = screen.getByRole("textbox", {
        name: "First name",
      });
      expect(input.placeholder).toEqual("Enter your first name");
    });

    it("ignores placeholder in floating variant", () => {
      render(
        <Input
          label="First name"
          variant="floating"
          placeholder="Enter your first name"
        />,
      );
      const input: HTMLInputElement = screen.getByRole("textbox", {
        name: "First name",
      });
      expect(input.placeholder).toEqual("");
    });

    it("defaults to floating variant (placeholder ignored)", () => {
      render(<Input label="First name" placeholder="Enter your first name" />);
      const input: HTMLInputElement = screen.getByRole("textbox", {
        name: "First name",
      });
      expect(input.placeholder).toEqual("");
      expect(
        document.querySelector(".c__input__label"),
      ).not.toBeInTheDocument();
    });

    it("does not wrap the label when no description is given", () => {
      render(<Input label="First name" variant="classic" />);
      expect(
        document.querySelector(".c__field__label-block"),
      ).not.toBeInTheDocument();
      // The label stays a direct child of the field, as it has always been.
      expect(
        document.querySelector(".c__input__label")?.parentElement,
      ).toHaveClass("c__field");
    });
  });

  describe("inline variant", () => {
    it("renders the label in a label block beside the field", () => {
      render(<Input label="First name" variant="inline" />);
      expect(document.querySelector(".c__field--inline")).toBeInTheDocument();
      const block = document.querySelector(".c__field__label-block");
      expect(block).toBeInTheDocument();
      expect(block?.parentElement).toHaveClass("c__field");
      expect(screen.getByText("First name")).toHaveClass("c__input__label");
    });

    it("applies the inline wrapper modifier and not the classic one", () => {
      render(<Input label="First name" variant="inline" />);
      expect(
        document.querySelector(".c__input__wrapper--inline"),
      ).toBeInTheDocument();
      expect(
        document.querySelector(".c__input__wrapper--classic"),
      ).not.toBeInTheDocument();
    });

    it("uses the native placeholder like the classic variant", () => {
      render(
        <Input
          label="First name"
          variant="inline"
          placeholder="Enter your first name"
        />,
      );
      const input: HTMLInputElement = screen.getByRole("textbox", {
        name: "First name",
      });
      expect(input.placeholder).toEqual("Enter your first name");
    });

    it("renders labelDescription and points aria-describedby at it", () => {
      render(
        <Input
          label="First name"
          labelDescription="As shown on your ID"
          variant="inline"
        />,
      );
      const input = screen.getByRole("textbox", { name: "First name" });
      const description = screen.getByText("As shown on your ID");
      expect(description).toHaveClass("c__field__label-description");
      expect(description.id).not.toEqual("");
      expect(input.getAttribute("aria-describedby")).toEqual(description.id);
    });

    it("adds no aria-describedby without a labelDescription", () => {
      render(<Input label="First name" variant="inline" />);
      expect(
        screen.getByRole("textbox", { name: "First name" }),
      ).not.toHaveAttribute("aria-describedby");
    });

    it("preserves a caller-supplied aria-describedby", () => {
      render(
        <Input
          label="First name"
          labelDescription="As shown on your ID"
          variant="inline"
          aria-describedby="external-hint"
        />,
      );
      const input = screen.getByRole("textbox", { name: "First name" });
      const description = screen.getByText("As shown on your ID");
      expect(input.getAttribute("aria-describedby")).toEqual(
        `external-hint ${description.id}`,
      );
    });

    it("greys out the label block when disabled", () => {
      render(
        <Input
          label="First name"
          labelDescription="As shown on your ID"
          variant="inline"
          disabled
        />,
      );
      expect(
        document.querySelector(".c__field__label-block--disabled"),
      ).toBeInTheDocument();
      expect(
        document.querySelector(".c__field__label-description--disabled"),
      ).toBeInTheDocument();
    });

    it("exposes labelWidth as a custom property on the field", () => {
      render(<Input label="First name" variant="inline" labelWidth="10rem" />);
      const field = document.querySelector(".c__field") as HTMLElement;
      expect(
        field.style.getPropertyValue(
          "--c--components--forms-field--inline-label-width",
        ),
      ).toEqual("10rem");
    });

    it("keeps the label accessible and drops the block with hideLabel", () => {
      render(
        <Input
          label="First name"
          labelDescription="As shown on your ID"
          variant="inline"
          hideLabel
        />,
      );
      expect(screen.getByText("First name")).toHaveClass("c__offscreen");
      expect(
        document.querySelector(".c__field__label-block"),
      ).not.toBeInTheDocument();
    });
  });

  describe("hideLabel", () => {
    it("hides label visually but keeps it accessible in floating variant", () => {
      render(<Input label="First name" hideLabel />);
      const input = screen.getByRole("textbox", { name: "First name" });
      expect(input).toBeInTheDocument();
      // Label should be visually hidden via LabelledBox
      const label = screen.getByText("First name");
      expect(label.closest("label")).toHaveClass("c__offscreen");
    });

    it("hides label visually but keeps it accessible in classic variant", () => {
      render(<Input label="First name" variant="classic" hideLabel />);
      const input = screen.getByRole("textbox", { name: "First name" });
      expect(input).toBeInTheDocument();
      // Label should be visually hidden with c__offscreen class
      const label = screen.getByText("First name");
      expect(label).toHaveClass("c__offscreen");
      // The visible label class should not be present
      expect(
        document.querySelector(".c__input__label"),
      ).not.toBeInTheDocument();
    });
  });
});
