import type { Meta, StoryObj } from "@storybook/react";

import { Hero, HomeGutter } from "./Hero";

const meta = {
  title: "Components/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <HomeGutter>
      <Hero {...args} />
    </HomeGutter>
  ),
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Stockage et partage faciles.",
    subtitle:
      "Stockez et partagez vos fichiers simplement dans un espace cloud collaboratif synchronisé.",
    logo: <img src="/storybook/logo-fichiers.svg" alt="DocLogo" width={64} />,
    banner: "/storybook/hero-image.png",
  },
};
