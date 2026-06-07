import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Example = () => (
  <Tabs defaultValue="overview" className="w-80">
    <TabsList>
      <TabsTrigger value="overview">概要</TabsTrigger>
      <TabsTrigger value="program">プログラム</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">イベントの概要です。</TabsContent>
    <TabsContent value="program">当日のプログラムです。</TabsContent>
  </Tabs>
);

export const Default: Story = { render: () => <Example /> };

// インタラクションテスト: タブ切り替えで表示内容が変わる
export const SwitchTab: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("イベントの概要です。")).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "プログラム" }));
    await expect(canvas.getByText("当日のプログラムです。")).toBeVisible();
    await expect(canvas.getByRole("tab", { name: "プログラム" })).toHaveAttribute("data-state", "active");
  },
};
