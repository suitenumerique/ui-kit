import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { DatePicker, DateRangePicker } from ":/components/forms/date-picker";
import { Input } from ":/components/forms/input";
import { Checkbox } from ":/components/forms/checkbox";
import { Button } from ":/components/button";
import { Select } from ":/components/forms/select";
import { FileUploader, UploadFile } from ":/components/form/file-uploader";
import { Switch } from ":/components/forms/switch";
import { Radio } from ":/components/forms/radio";
import { TextArea } from ":/components/forms/text-area";
import {
  stacked,
  variantControl,
  VariantArgs,
} from ":/components/forms/examples/variant-control";

export default {
  title: "Components/Forms/Examples",
  ...variantControl,
} as Meta<VariantArgs>;

export const Login = ({ variant }: VariantArgs) => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <h1
        className="fs-h3 fw-bold clr-content-semantic-neutral-primary"
        style={{ textAlign: "center" }}
      >
        Log in
      </h1>
      <Input variant={variant} label="Email" fullWidth={true} />
      <Input
        variant={variant}
        label="Password"
        type="password"
        text="Forgot your password?"
        fullWidth={true}
        name="password"
        required={true}
      />
      <div>
        <Checkbox label="Remember me" />
      </div>
      <Button fullWidth={true}>Log in</Button>
      <div
        className="fs-m clr-content-semantic-neutral-primary"
        style={{ textAlign: "center" }}
      >
        You do not have an account?{" "}
        <a href="/#" className="clr-content-semantic-neutral-primary">
          Register
        </a>
      </div>
    </form>
  );
};

export const Application = ({ variant }: VariantArgs) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
      }}
      method="get"
    >
      <h1
        className="fs-h3 fw-bold clr-content-semantic-neutral-primary"
        style={{ textAlign: "center" }}
      >
        Application
      </h1>
      <Select
        variant={variant}
        label="Context"
        options={[
          {
            label: "Ask a document",
          },
          {
            label: "Download files",
          },
          {
            label: "Ask for help",
          },
        ]}
        fullWidth={true}
        clearable={true}
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <Input variant={variant} label="First name" />
        <Input variant={variant} label="Last name" />
      </div>
      <Input
        variant={variant}
        label="Email address"
        fullWidth={true}
        text="Only @acme.com domain is authorized"
      />
      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ width: "25%" }}>
          <Input variant={variant} label="ZIP" fullWidth={true} />
        </div>
        <Input variant={variant} label="City" fullWidth={true} />
      </div>
      <div>
        <div className="fs-l clr-content-semantic-neutral-primary mb-t">
          Your curriculum vitae
        </div>
        <FileUploader
          accept="application/pdf"
          maxSize={4 * 1000 * 1000}
          files={files}
          onAddFiles={setFiles}
          onRemoveFile={(file) =>
            setFiles((previousFiles) =>
              previousFiles.filter((item) => item.id !== file.id),
            )
          }
        />
      </div>
      <Select
        variant={variant}
        label="Skills"
        options={[
          {
            label: "Communication",
          },
          {
            label: "Teamwork",
          },
          {
            label: "Problem solving",
          },
          {
            label: "Leadership",
          },
          {
            label: "Work ethic",
          },
        ]}
        multi={true}
        fullWidth={true}
      />
      <div>
        <TextArea
          variant={variant}
          label="Cover letter"
          fullWidth={true}
          rows={5}
        />
      </div>
      <div>
        <Switch label="SMS Notification" fullWidth={true} />
        <Switch label="Subscribe to newsletter" fullWidth={true} />
      </div>
      <Checkbox label="Agree to the terms and services" fullWidth={true} />
      <Button fullWidth={true}>Apply</Button>
      <a
        href="/#"
        className="clr-content-semantic-neutral-primary fs-m"
        style={{ textAlign: "center" }}
      >
        Need help ?
      </a>
    </form>
  );
};

export const Sports = ({ variant }: VariantArgs) => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <h1
        className="fs-h3 fw-bold clr-content-semantic-neutral-primary"
        style={{ textAlign: "center" }}
      >
        Register
      </h1>
      <div>
        <div className="fs-l clr-content-semantic-neutral-primary mb-t">
          Gender
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Radio name="gender" label="Male" fullWidth={true} />
          <Radio name="gender" label="Female" />
          <Radio name="gender" label="Other" />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Input variant={variant} label="First name" />
        <Input variant={variant} label="Last name" />
      </div>

      <DatePicker
        variant={stacked(variant)}
        label="Date of birth"
        fullWidth={true}
      />
      <Select
        variant={variant}
        label="Competition"
        options={[
          {
            label: "Athletics",
          },
          {
            label: "Swimming",
          },
          {
            label: "Marathon",
          },
        ]}
        fullWidth={true}
      />
      <Select
        variant={variant}
        label="Previous rewards"
        multi={true}
        options={[
          {
            label: "Bronze",
          },
          {
            label: "Silver",
          },
          {
            label: "Gold",
          },
          {
            label: "Flocon",
          },
          {
            label: "Ourson",
          },
          {
            label: "Chamois",
          },
        ]}
        fullWidth={true}
      />
      <DateRangePicker
        variant={stacked(variant)}
        startLabel="Start date"
        endLabel="End date"
        defaultValue={[
          "2023-05-23T00:00:00.000+00:00",
          "2023-06-23T00:00:00.000+00:00",
        ]}
        fullWidth={true}
      />
      <Button fullWidth={true}>Apply</Button>
      <a
        href="/#"
        className="clr-content-semantic-neutral-primary fs-m"
        style={{ textAlign: "center" }}
      >
        Need help ?
      </a>
    </form>
  );
};
export const SportsDisabled = ({ variant }: VariantArgs) => {
  const [withValues, setWithValues] = useState(false);
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
      }}
    >
      <h1
        className="fs-h3 fw-bold clr-content-semantic-neutral-primary"
        style={{ textAlign: "center" }}
      >
        Register
      </h1>
      <div>
        <div className="fs-l clr-content-semantic-neutral-primary mb-t">
          Gender
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Radio name="gender" label="Male" fullWidth={true} disabled={true} />
          <Radio name="gender" label="Female" disabled={true} />
          <Radio name="gender" label="Other" disabled={true} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Input
          variant={variant}
          label="First name"
          disabled={true}
          value={withValues ? "John" : undefined}
        />
        <Input variant={variant} label="Last name" disabled={true} />
      </div>

      <DatePicker
        variant={stacked(variant)}
        label="Date of birth"
        fullWidth={true}
        disabled={true}
        value={withValues ? "2023-05-23T00:00:00.000+00:00" : undefined}
      />
      <Select
        variant={variant}
        disabled={true}
        label="Competition"
        options={[
          {
            label: "Athletics",
          },
          {
            label: "Swimming",
          },
          {
            label: "Marathon",
          },
        ]}
        fullWidth={true}
        value={withValues ? "Swimming" : undefined}
      />
      <Select
        variant={variant}
        disabled={true}
        label="Previous rewards"
        multi={true}
        options={[
          {
            label: "Bronze",
          },
          {
            label: "Silver",
          },
          {
            label: "Gold",
          },
          {
            label: "Flocon",
          },
          {
            label: "Ourson",
          },
          {
            label: "Chamois",
          },
        ]}
        fullWidth={true}
        value={withValues ? ["Silver"] : undefined}
      />
      <DateRangePicker
        variant={stacked(variant)}
        startLabel="Start date"
        endLabel="End date"
        value={
          withValues
            ? ["2023-05-23T00:00:00.000+00:00", "2023-06-23T00:00:00.000+00:00"]
            : undefined
        }
        fullWidth={true}
        disabled={true}
      />
      <Switch
        label="Enable values"
        checked={withValues}
        onChange={(e) => setWithValues(e.target.checked)}
      />
      <Button fullWidth={true} disabled={true}>
        Apply
      </Button>
      <a
        href="/#"
        className="clr-content-semantic-neutral-primary fs-m"
        style={{ textAlign: "center" }}
      >
        Need help ?
      </a>
    </form>
  );
};
