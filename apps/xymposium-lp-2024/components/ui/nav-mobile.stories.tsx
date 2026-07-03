import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileNav } from "./nav-mobile";

const items = [
  { title: "Home", href: "/" },
  { title: "Registration", href: "/registration" },
  { title: "Terms", href: "/terms" },
];

const meta = {
  title: "UI/MobileNav",
  component: MobileNav,
  // 開いた状態のモバイルメニュー。実機の開閉導線は E2E (モバイルビューポート) で検証する。
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: { items },
} satisfies Meta<typeof MobileNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
