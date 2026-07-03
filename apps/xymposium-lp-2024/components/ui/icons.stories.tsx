import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Icons } from "./icons";

const meta = {
  title: "UI/Icons",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 全アイコンのカタログ
export const Catalog: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      {Object.entries(Icons).map(([name, Icon]) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon className="h-6 w-6" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
};
