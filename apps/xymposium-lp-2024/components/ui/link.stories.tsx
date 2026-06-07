import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link } from "./link";

const meta = {
  title: "UI/Link",
  component: Link,
  // next/link を使うため App Router のモックを有効化
  parameters: { layout: "centered", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: { href: "/", children: "リンク" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "button"],
    },
    size: { control: "select", options: ["default", "button", "buttonSm", "buttonLg", "buttonIcon"] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AsButton: Story = { args: { variant: "button", size: "button", children: "ホームへ戻る" } };
export const Outline: Story = { args: { variant: "outline", size: "button", children: "Outline" } };
export const Secondary: Story = { args: { variant: "secondary", size: "button", children: "Secondary" } };
