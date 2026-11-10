import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";
import { Tooltip } from ":/components/tooltip/index";
import { Button } from ":/components/button";

describe("<Tooltip />", () => {
  it("appear on button hover and then disappear", async () => {
    render(
      <Tooltip content="Hi there" closeDelay={0}>
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");
    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
    const user = userEvent.setup();
    fireEvent.mouseMove(document.body);
    await user.hover(button);
    expect(await screen.findByText("Hi there")).toBeInTheDocument();

    await user.unhover(button);
    await waitForElementToBeRemoved(screen.queryByText("Hi there"));
  });
  it("describes the trigger with a tooltip and closes it on Escape", async () => {
    render(
      <Tooltip content="Hi there" closeDelay={0}>
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    const user = userEvent.setup();
    await user.tab();

    const button = screen.getByRole("button");
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Hi there");
    expect(button).toHaveAttribute("aria-describedby", tooltip.id);
    expect(tooltip.querySelector("svg")).toHaveAttribute("aria-hidden", "true");

    await user.keyboard("{Escape}");
    await waitForElementToBeRemoved(tooltip);
    expect(button).toHaveFocus();
    expect(button).not.toHaveAttribute("aria-describedby");
  });
  it("appear on button focus and then disappear", async () => {
    render(
      <Tooltip content="Hi there" closeDelay={0}>
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
    const user = userEvent.setup();

    await user.tab();
    expect(await screen.findByText("Hi there")).toBeInTheDocument();

    await user.tab();
    await waitForElementToBeRemoved(screen.queryByText("Hi there"));
  });
  it("sets entering and exiting class", async () => {
    render(
      <Tooltip content="Hi there" closeDelay={0}>
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
    const user = userEvent.setup();

    const button = screen.getByRole("button");

    fireEvent.mouseMove(document.body);
    await user.hover(button);

    // Make sure the tooltip is entering.
    await waitFor(() => {
      const tooltip = document.querySelector(".c__tooltip");
      expect(tooltip).toHaveClass("c__tooltip--entering");
      expect(tooltip).not.toHaveClass("c__tooltip--exiting");
    });

    // Make sure the entering class is removed and the exiting class is not added yet.
    await waitFor(() => {
      const tooltip = document.querySelector(".c__tooltip");
      expect(tooltip).not.toHaveClass("c__tooltip--entering");
      expect(tooltip).not.toHaveClass("c__tooltip--exiting");
    });

    await user.unhover(button);

    // Make sure the tooltip is exiting.
    await waitFor(() => {
      const tooltip = document.querySelector(".c__tooltip");
      expect(tooltip).not.toHaveClass("c__tooltip--entering");
      expect(tooltip).toHaveClass("c__tooltip--exiting");
    });

    // Make sure the tooltip is removed.
    await waitForElementToBeRemoved(document.querySelector(".c__tooltip"));
  });
  it("works with HTML", async () => {
    render(
      <Tooltip
        content={
          <>
            <h1>Title</h1>
            <p>Description</p>
          </>
        }
        closeDelay={0}
      >
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");
    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();
    const user = userEvent.setup();
    fireEvent.mouseMove(document.body);
    await user.hover(button);
    await screen.findByRole("heading", { name: "Title" });
    await screen.findByText("Description");
  });
  it("renders with className", async () => {
    render(
      <Tooltip
        content={
          <>
            <h1>Title</h1>
            <p>Description</p>
          </>
        }
        closeDelay={0}
        className="my-custom-class"
      >
        <Button size="nano" variant="tertiary">
          ⬅️
        </Button>
      </Tooltip>,
    );

    const button = screen.getByRole("button");
    expect(screen.queryByText("Hi there")).not.toBeInTheDocument();

    const user = userEvent.setup();
    fireEvent.mouseMove(document.body);
    await user.hover(button);

    await waitFor(() => {
      const tooltip = document.querySelector(".c__tooltip");
      expect(tooltip).toHaveClass("my-custom-class");
    });
  });

  // The open and close animations each schedule a timeout. It has to be
  // cancelled before the next one, and on unmount, or it fires setState after
  // the jsdom window is gone.
  const trackAnimationTimers = () => {
    const scheduled: ReturnType<typeof setTimeout>[] = [];
    const realSet = window.setTimeout;
    const realClear = window.clearTimeout;
    const setSpy = vi
      .spyOn(window, "setTimeout")
      .mockImplementation(((handler, timeout, ...args) => {
        const id = realSet(
          handler as TimerHandler,
          timeout as number,
          ...(args as []),
        );
        if (timeout === 200) {
          scheduled.push(id);
        }
        return id;
      }) as typeof window.setTimeout);
    const clearSpy = vi.spyOn(window, "clearTimeout");
    return {
      scheduled,
      clearSpy,
      restore: () => {
        scheduled.forEach((id) => realClear(id));
        setSpy.mockRestore();
        clearSpy.mockRestore();
      },
    };
  };

  it("clears the animation timer before the next open or close", async () => {
    const timers = trackAnimationTimers();
    try {
      render(
        <Tooltip content="Hi there" closeDelay={0}>
          <Button size="nano" variant="tertiary">
            ⬅️
          </Button>
        </Tooltip>,
      );

      const user = userEvent.setup();
      await user.tab();
      expect(timers.scheduled.length).toBeGreaterThan(0);
      const opening = timers.scheduled.at(-1);

      await user.tab();
      expect(timers.clearSpy).toHaveBeenCalledWith(opening);
    } finally {
      timers.restore();
    }
  });

  it("clears the animation timer on unmount", async () => {
    const timers = trackAnimationTimers();
    try {
      const { unmount } = render(
        <Tooltip content="Hi there" closeDelay={0}>
          <Button size="nano" variant="tertiary">
            ⬅️
          </Button>
        </Tooltip>,
      );

      const user = userEvent.setup();
      await user.tab();
      expect(timers.scheduled.length).toBeGreaterThan(0);

      unmount();
      expect(timers.clearSpy).toHaveBeenCalledWith(timers.scheduled.at(-1));
    } finally {
      timers.restore();
    }
  });
});
