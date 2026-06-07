import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TokyoNodeBanner from "@/assets/tokyo-node-banner.webp";
import HeroWithImage from "./hero-with-image";

const meta = {
  title: "Features/HeroWithImage",
  component: HeroWithImage,
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  tags: ["autodocs"],
  args: {
    title: "What's in Xymposium?",
    image: TokyoNodeBanner,
    imageAlt: "Tokyo node banner",
    description: "東京ノードにて、Symbol/XYM のイベントを開催します。",
  },
} satisfies Meta<typeof HeroWithImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLink: Story = { args: { imageHref: "https://x.com/" } };
