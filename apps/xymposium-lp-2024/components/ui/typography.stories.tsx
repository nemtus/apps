import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { H1, H2, H3, Paragraph } from "./typography";

const meta = {
  title: "UI/Typography",
  component: H1,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = { args: { children: "見出し H1 / Heading 1" } };

export const AllVariants: StoryObj = {
  render: () => (
    <div>
      <H1>H1 見出し</H1>
      <H2>H2 見出し</H2>
      <H3>H3 見出し</H3>
      <Paragraph>本文テキスト (Paragraph)。Symbol/NEM Community Xymposium のイベント概要などを表示します。</Paragraph>
    </div>
  ),
};
