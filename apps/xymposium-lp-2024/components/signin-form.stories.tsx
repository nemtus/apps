import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SignInForm } from "./signin-form";

const meta = {
  title: "Forms/SignInForm",
  component: SignInForm,
  // SignInForm は next/navigation の useRouter を使うため App Router のモックを有効化する
  parameters: { layout: "centered", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
} satisfies Meta<typeof SignInForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// インタラクションテスト: メール/パスワードを入力できる
export const FillsCredentials: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const email = canvas.getByPlaceholderText("name@example.com");
    const password = canvas.getByPlaceholderText("password");

    await userEvent.type(email, "taro@example.com");
    await userEvent.type(password, "s3cret-pass");

    await expect(email).toHaveValue("taro@example.com");
    await expect(password).toHaveValue("s3cret-pass");

    // 送信ボタンが表示されている
    await expect(canvas.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  },
};
