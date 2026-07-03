import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HatchetIcon from "@/assets/images/hatchet.png";
import JaguarIcon from "@/assets/images/jaguar.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import AnimatedScrollingTestimonials from "./animated-scrolling-testimonials";

const meta = {
  title: "UI/Animated/ScrollingTestimonials",
  component: AnimatedScrollingTestimonials,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  args: {
    data: [
      { name: "Hatchet", image: HatchetIcon, description: "Symbol/NEM コア開発者" },
      { name: "Jaguar0625", image: JaguarIcon, description: "Symbol/NEM コア開発者" },
      { name: "NEMTUS", image: NemtusIcon, description: "NPO 法人" },
    ],
  },
} satisfies Meta<typeof AnimatedScrollingTestimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
