import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TimeTable from "./time-table";

const meta = {
  title: "Features/TimeTable",
  component: TimeTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    caption: "一部前後、延長する場合がございます",
    data: [
      { time: "18:30", title: "開場", description: "-" },
      { time: "19:00", title: "挨拶", description: "NEMTUS理事長 後藤博之" },
      { time: "19:10", title: "Xymposium Session", description: "コア開発者 Hatchet" },
      { time: "20:00", title: "Q&A や他参加者との交流", description: "コア開発者メンバー" },
      { time: "22:00", title: "終了", description: "-" },
    ],
  },
} satisfies Meta<typeof TimeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { caption: "準備中", data: [] } };
