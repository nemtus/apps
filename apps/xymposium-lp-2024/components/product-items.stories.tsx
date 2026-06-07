import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProductItemLinks from "./product-items";

const meta = {
  title: "Features/ProductItems",
  component: ProductItemLinks,
  parameters: { layout: "padded", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: {
    data: [
      { title: "NEMTUS", href: "https://nemtus.com", description: "NPO 法人 NEM 技術普及推進会" },
      { title: "FOOD NFT", href: "https://example.com", description: "味覚データを NFT 化するプロジェクト" },
      { title: "Symbol", href: "https://symbol-community.com", description: "次世代ブロックチェーン Symbol" },
    ],
  },
} satisfies Meta<typeof ProductItemLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
