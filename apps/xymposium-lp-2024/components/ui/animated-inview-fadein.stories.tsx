import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AnimatedInViewFadeIn from "./animated-inview-fadein";

const meta = {
  title: "UI/Animated/InViewFadeIn",
  component: AnimatedInViewFadeIn,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    children: <div className="rounded-lg border p-8">スクロールで表示される要素</div>,
  },
} satisfies Meta<typeof AnimatedInViewFadeIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
