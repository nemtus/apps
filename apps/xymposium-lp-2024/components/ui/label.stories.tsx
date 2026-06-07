import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { children: "Email" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: StoryObj = {
  render: () => (
    <div className="grid w-72 gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  ),
};
