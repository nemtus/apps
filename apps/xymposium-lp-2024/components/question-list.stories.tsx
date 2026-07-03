import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import QuestionList from "./question-list";

const data = [
  { question: "参加にあたって注意事項はありますか？", answer: "利用規約をご確認下さい。" },
  { question: "東京ノード会場での Xymposium に参加できますか？", answer: "イベントページをご確認下さい。" },
  { question: "コアチームメンバーの話を聞きたいのですが英語はわかりません。", answer: "登壇中は通訳が入ります。" },
];

const meta = {
  title: "Features/QuestionList",
  component: QuestionList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { data },
} satisfies Meta<typeof QuestionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// インタラクションテスト: 質問をクリックすると回答が表示される
export const RevealsAnswer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const question = canvas.getByRole("button", { name: data[0].question });

    await expect(question).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(question);
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText(data[0].answer)).toBeVisible();
  },
};
