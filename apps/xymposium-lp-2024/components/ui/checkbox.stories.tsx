import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };

export const WithLabel: StoryObj = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

// インタラクションテスト: クリックで checked がトグルし onCheckedChange が呼ばれる
export const Toggles: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");

    await expect(checkbox).toHaveAttribute("data-state", "unchecked");
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute("data-state", "checked");
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute("data-state", "unchecked");
  },
};
