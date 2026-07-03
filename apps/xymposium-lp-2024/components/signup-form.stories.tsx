import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SignUpForm } from "./signup-form";

const meta = {
  title: "Forms/SignUpForm",
  component: SignUpForm,
  // 内部の Link が next/link を使うため App Router をモック
  parameters: { layout: "centered", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// 現状は受付終了状態のメッセージを表示する
export const ClosedState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("受付を終了しました")).toBeVisible();
  },
};
