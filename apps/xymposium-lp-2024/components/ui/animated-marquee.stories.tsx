import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AnimatedMarquee from "./animated-marquee";

const meta = {
  title: "UI/Animated/Marquee",
  component: AnimatedMarquee,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    children: <div className="mx-2 rounded-md bg-secondary px-6 py-3">Symbol</div>,
  },
} satisfies Meta<typeof AnimatedMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Reverse: Story = { args: { reverse: true } };
