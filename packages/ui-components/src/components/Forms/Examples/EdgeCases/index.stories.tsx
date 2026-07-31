import { Meta } from "@storybook/react";
import React, { useState } from "react";
import { Input } from ":/components/Forms/Input";
import { Checkbox } from ":/components/Forms/Checkbox";
import { Button } from ":/components/Button";
import { Select } from ":/components/Forms/Select";
import { CunninghamProvider } from ":/components/Provider";
import { FileUploader, UploadFile } from ":/components/form/file-uploader";
import { Switch } from ":/components/Forms/Switch";

export default {
  title: "Components/Forms/Examples/Edge Cases",
} as Meta;

export const OverflowLabels = () => {
  const overflow = " and some very long overflowing text";
  const [files, setFiles] = useState<UploadFile[]>([]);
  return (
    <CunninghamProvider>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1
          className="fs-h3 fw-bold clr-gray-900"
          style={{ textAlign: "center" }}
        >
          Application
        </h1>
        <Select
          label={"Context" + overflow}
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
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flexGrow: 1 }}>
            <Input label={"First name" + overflow} fullWidth={true} />
          </div>
          <div style={{ flexGrow: 1 }}>
            <Input label={"Last name" + overflow} fullWidth={true} />
          </div>
        </div>
        <Input
          label={"Email address" + overflow}
          fullWidth={true}
          text="Only @acme.com domain is authorized"
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ width: "25%" }}>
            <Input label={"ZIP" + overflow} fullWidth={true} />
          </div>
          <Input label={"City" + overflow} fullWidth={true} />
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
    </CunninghamProvider>
  );
};
