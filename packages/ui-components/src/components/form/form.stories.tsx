import { Checkbox, Radio, RadioGroup, Switch } from ":/cunningham";

import { Button, Select, TextArea } from ":/cunningham";

import { Input } from ":/cunningham";
import { Meta } from "@storybook/react";
import { Label } from "./label/label";
import {
  variantControl,
  VariantArgs,
} from ":/components/forms/examples/variant-control";

export default {
  title: "Components/Forms/Examples",
  ...variantControl,
} as Meta<VariantArgs>;

const CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
];
const OPTIONS = CITIES.map((city) => ({
  label: city,
  value: city.toLowerCase(),
}));

export const Example = ({ variant }: VariantArgs) => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <Input variant={variant} label="Email" fullWidth={true} />
      <Select
        variant={variant}
        label="Sélectionner une ville"
        fullWidth={true}
        options={OPTIONS}
      />
      <TextArea variant={variant} label="Description" fullWidth={true} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Label id="gender-label" text="Sélectionner votre genre">
          Genre
        </Label>
        <RadioGroup aria-labelledby="gender-label" fullWidth={true}>
          <Radio name="gender" label="Masculin" fullWidth={true} />
          <Radio name="gender" label="Féminin" fullWidth={true} />
          <Radio name="gender" label="Autre" fullWidth={true} />
        </RadioGroup>
      </div>
      <div>
        <Switch label="SMS Notification" fullWidth={true} />
        <Switch label="Subscribe to newsletter" fullWidth={true} />
      </div>
      <Checkbox label="Agree to the terms and services" fullWidth={true} />
      <Button fullWidth={true}>Envoyer</Button>
      <Button fullWidth={true} variant="secondary">
        Annuler
      </Button>
    </form>
  );
};
