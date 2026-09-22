import { Meta, StoryFn } from "@storybook/react";
import React, { useState } from "react";
import { CalendarDate, DateValue } from "@internationalized/date";
import { Calendar, CalendarRange } from ":/components/calendar/CalendarAux";
import { Modal, ModalSize, useModal } from ":/components/modal";
import { Button } from ":/components/button";

export default {
  title: "Components/Calendar",
  component: Calendar,
} as Meta<typeof Calendar>;

export const Default: StoryFn<typeof Calendar> = () => (
  <>
    <Calendar />
  </>
);

export const Controlled: StoryFn<typeof Calendar> = () => {
  const [value, setValue] = useState<DateValue | null>(null);
  return (
    <>
      <Calendar value={value} onChange={setValue} />
      <p>Selected: {value?.toString() ?? "none"}</p>
    </>
  );
};

export const WithFooter: StoryFn<typeof Calendar> = () => {
  const [value, setValue] = useState<DateValue | null>(null);
  const [confirmed, setConfirmed] = useState<string>("none");
  return (
    <>
      <Calendar
        value={value}
        onChange={setValue}
        onOk={(val) => setConfirmed(val?.toString() ?? "none")}
        onCancel={() => setValue(null)}
        onReset={() => setValue(null)}
      />
      <p>Confirmed: {confirmed}</p>
    </>
  );
};

export const WithMinMax: StoryFn<typeof Calendar> = () => (
  <>
    <Calendar
      minValue={new CalendarDate(2024, 1, 1)}
      maxValue={new CalendarDate(2024, 12, 31)}
    />
  </>
);

export const RangeDefault: StoryFn<typeof CalendarRange> = () => (
  <>
    <CalendarRange />
  </>
);

export const RangeWithFooter: StoryFn<typeof CalendarRange> = () => (
  <>
    <CalendarRange
      onOk={() => alert("OK")}
      onCancel={() => alert("Cancel")}
      onReset={() => alert("Reset")}
    />
  </>
);

export const InModal: StoryFn<typeof Calendar> = () => {
  const modal = useModal();
  const [value, setValue] = useState<DateValue | null>(null);
  return (
    <>
      <Button onClick={modal.open}>Open Calendar in Modal</Button>
      <Modal {...modal} title="Select a date" size={ModalSize.SMALL}>
        <Calendar
          value={value}
          onChange={setValue}
          onOk={() => modal.close()}
          onCancel={() => modal.close()}
          onReset={() => setValue(null)}
        />
      </Modal>
    </>
  );
};
