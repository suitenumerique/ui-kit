import { Checkbox, Radio, RadioGroup, Switch } from "@openfun/cunningham-react";

import { Button, Select, TextArea } from "@openfun/cunningham-react";

import { Input } from "@openfun/cunningham-react";
import { Meta } from "@storybook/react/*";
import { Label } from "./label/label";

export default {
  title: "Components/Forms/Examples",
} as Meta;

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

export const Example = () => {
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "300px",
      }}
    >
      <Input label="Email" fullWidth={true} />
      <Select
        label="Sélectionner une ville"
        fullWidth={true}
        options={OPTIONS}
      />
      <TextArea label="Description" fullWidth={true} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <Label text="Sélectionner votre genre">Genre</Label>
        <RadioGroup fullWidth={true}>
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
      <Button fullWidth={true} color="secondary">
        Annuler
      </Button>
    </form>
  );
};
