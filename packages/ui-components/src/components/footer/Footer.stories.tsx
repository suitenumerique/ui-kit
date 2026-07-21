import type { Meta, StoryObj } from "@storybook/react";

import { Footer } from "./Footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutProps: Story = {};

export const WithProps: Story = {
  args: {
    externalLinks: [
      {
        label: "legifrance.gouv.fr",
        href: "https://legifrance.gouv.fr/",
      },
      {
        label: "info.gouv.fr",
        href: "https://info.gouv.fr/",
      },
      {
        label: "service-public.fr",
        href: "https://service-public.fr/",
      },
      {
        label: "data.gouv.fr",
        href: "https://data.gouv.fr/",
      },
    ],
    legalLinks: [
      {
        label: "Legal Mentions",
        href: "/legal-notice",
      },
      {
        label: "Personal Data and cookies",
        href: "/personal-data-cookies",
      },
      {
        label: "Accessibility: non-compliant",
        href: "/accessibility",
      },
    ],
    license: {
      label: "Unless otherwise stated, all content on this site is under",
      link: {
        label: "licence etalab-2.0",
        href: "https://github.com/etalab/licence-ouverte/blob/master/LO.md",
      },
    },
  },
};