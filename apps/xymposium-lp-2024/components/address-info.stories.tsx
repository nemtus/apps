import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Paragraph } from "@/components/ui/typography";
import AddressInfo from "./address-info";

const meta = {
  title: "Features/AddressInfo",
  component: AddressInfo,
  parameters: { layout: "padded", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: {
    title: "開催概要",
    googleMapUrl: "https://www.google.com/maps/embed?pb=placeholder",
    tableContents: [
      <div key="date">
        <Paragraph className="font-bold">日程</Paragraph>
        <Paragraph>2024年 09月 27日（金）</Paragraph>
      </div>,
      <div key="time">
        <Paragraph className="font-bold">時間</Paragraph>
        <Paragraph>19時 00分 〜 22時 00分</Paragraph>
      </div>,
      <div key="fee">
        <Paragraph className="font-bold">参加費</Paragraph>
        <Paragraph>無料</Paragraph>
      </div>,
    ],
  },
} satisfies Meta<typeof AddressInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
