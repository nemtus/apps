import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;
// Accordion Root は `type` が必須の判別ユニオンのため、render のみのストーリーは
// args を要求しない非ジェネリックな StoryObj で型付けする
type Story = StoryObj;

const Example = () => (
  <Accordion type="single" collapsible className="w-96">
    <AccordionItem value="item-1">
      <AccordionTrigger>参加にあたって注意事項はありますか？</AccordionTrigger>
      <AccordionContent>利用規約をご確認ください。</AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>会場はどこですか？</AccordionTrigger>
      <AccordionContent>東京都新宿区の会場で開催します。</AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Default: Story = { render: () => <Example /> };

// インタラクションテスト: トリガークリックで開閉する
export const ExpandCollapse: Story = {
  render: () => <Example />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "参加にあたって注意事項はありますか？" });

    // 初期状態は閉じている
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText("利用規約をご確認ください。")).toBeVisible();

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};
