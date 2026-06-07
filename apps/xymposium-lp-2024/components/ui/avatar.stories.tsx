import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: StoryObj = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://avatars.githubusercontent.com/u/0" alt="user" />
      <AvatarFallback>NT</AvatarFallback>
    </Avatar>
  ),
};

// 画像が無い/読み込めない場合はフォールバックを表示する
export const Fallback: StoryObj = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="" />
      <AvatarFallback>NT</AvatarFallback>
    </Avatar>
  ),
};
