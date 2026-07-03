import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AnimatedBorderTrail from "./animated-border-trail";

const meta = {
  title: "UI/Animated/BorderTrail",
  component: AnimatedBorderTrail,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    children: <span className="px-6 py-2">受付を終了しました</span>,
  },
} satisfies Meta<typeof AnimatedBorderTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LargeTrail: Story = { args: { trailSize: "lg", trailColor: "violet" } };
