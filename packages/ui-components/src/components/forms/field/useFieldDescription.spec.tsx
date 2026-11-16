import { renderHook } from "@testing-library/react";
import { useFieldDescription } from ":/components/forms/field/useFieldDescription";

describe("useFieldDescription", () => {
  it("describes nothing without a text nor a label description", () => {
    const { result } = renderHook(() => useFieldDescription({ id: "email" }));
    expect(result.current).toEqual({
      id: "email",
      descriptionId: undefined,
      textId: undefined,
      describedBy: undefined,
    });
  });

  it("names the ids after the control id", () => {
    const { result } = renderHook(() =>
      useFieldDescription({
        id: "email",
        text: "The email is required.",
        labelDescription: "We never share it.",
      }),
    );
    expect(result.current.descriptionId).toBe("email-description");
    expect(result.current.textId).toBe("email-text");
    expect(result.current.describedBy).toBe("email-description email-text");
  });

  it("keeps the given aria-describedby first", () => {
    const { result } = renderHook(() =>
      useFieldDescription({
        id: "email",
        text: "The email is required.",
        ariaDescribedBy: "hint",
      }),
    );
    expect(result.current.describedBy).toBe("hint email-text");
  });

  it("keeps the given aria-describedby alone", () => {
    const { result } = renderHook(() =>
      useFieldDescription({ id: "email", ariaDescribedBy: "hint" }),
    );
    expect(result.current.describedBy).toBe("hint");
  });

  it("generates a stable id when none is given", () => {
    const { result, rerender } = renderHook(() =>
      useFieldDescription({ text: "Required." }),
    );
    const { id } = result.current;
    expect(id).toBeTruthy();
    expect(result.current.textId).toBe(`${id}-text`);
    rerender();
    expect(result.current.id).toBe(id);
  });
});
