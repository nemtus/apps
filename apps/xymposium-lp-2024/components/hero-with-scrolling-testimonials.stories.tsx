import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HatchetIcon from "@/assets/images/hatchet.png";
import JaguarIcon from "@/assets/images/jaguar.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import HeroWithScrollingTestimonials from "./hero-with-scrolling-testimonials";

const meta = {
  title: "Features/HeroWithScrollingTestimonials",
  component: HeroWithScrollingTestimonials,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    title: "参加者",
    description: "Symbol/NEM コミュニティのメンバーが参加します。",
    data: [
      { name: "Hatchet", image: HatchetIcon, description: "Symbol/NEM コア開発者" },
      { name: "Jaguar0625", image: JaguarIcon, description: "Symbol/NEM コア開発者" },
      { name: "NEMTUS", image: NemtusIcon, description: "NPO 法人" },
    ],
  },
} satisfies Meta<typeof HeroWithScrollingTestimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
