import { Button } from "@openfun/cunningham-react";

export const ExportButton = () => {
  return (
    <div className="">
      <div className="section-container">
        <Button color="primary" size="medium">
          Primary
        </Button>
        <Button color="primary-text" size="medium">
          Primary text
        </Button>
        <Button color="secondary" size="medium">
          Secondary
        </Button>
        <Button color="tertiary" size="medium">
          Tertiary
        </Button>
        <Button color="danger" size="medium">
          Danger
        </Button>
      </div>
      <div className="section-container">
        <Button color="primary" size="medium" disabled>
          Primary
        </Button>
        <Button color="primary-text" size="medium" disabled>
          Primary text
        </Button>
        <Button color="secondary" size="medium" disabled>
          Secondary
        </Button>
        <Button color="tertiary" size="medium" disabled>
          Tertiary
        </Button>
        <Button color="danger" size="medium" disabled>
          Danger
        </Button>
      </div>
    </div>
  );
};
