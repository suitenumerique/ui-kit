import { ShareModalExample } from "./ShareModalExample";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Share/Modal",
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
};

export default meta;

export const Default = {
  render: () => <ShareModalExample />,
};
