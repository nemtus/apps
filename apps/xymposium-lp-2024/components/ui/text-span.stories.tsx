import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TextSpan from "./text-span";

const meta = {
  title: "UI/TextSpan",
  component: TextSpan,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { children: "折り返さない語句" },
} satisfies Meta<typeof TextSpan>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSentence: StoryObj = {
  render: () => (
    <p className="w-40 border p-2">
      これは <TextSpan className="font-bold">Symbol/NEM</TextSpan> の折り返し制御の例です。
    </p>
  ),
};
