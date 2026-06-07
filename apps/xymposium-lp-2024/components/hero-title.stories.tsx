import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeroTitle from "./hero-title";

const meta = {
  title: "Features/HeroTitle",
  component: HeroTitle,
  // 内部の Link が next/link を使うため App Router をモック
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
