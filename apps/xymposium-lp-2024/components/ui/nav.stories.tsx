import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MainNav } from "./nav";

const items = [
  { title: "Home", href: "/" },
  { title: "Registration", href: "/registration" },
  { title: "Programs", href: "/#programs" },
  { title: "Terms", href: "/terms" },
];

const meta = {
  title: "UI/MainNav",
  component: MainNav,
  // useSelectedLayoutSegment / next/link / next/image を使うため App Router をモック
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: { items },
} satisfies Meta<typeof MainNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoItems: Story = { args: { items: [] } };
