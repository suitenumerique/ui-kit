import type { Meta, StoryObj } from '@storybook/react';
import Badge from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const All: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <Badge uppercased type="accent">Accent</Badge>
      <Badge uppercased type="neutral">Neutral</Badge>
      <Badge uppercased type="info">Info</Badge>
      <Badge uppercased type="success">Success</Badge>
      <Badge uppercased type="warning">Warning</Badge>
      <Badge uppercased type="danger">Danger</Badge>
    </div>
  )
}

export const WithNumber: Story = {
  args: {
    children: '42',
  },
};

export const Uppercased: Story = {
  args: {
    children: 'new',
    uppercased: true,
  },
};
