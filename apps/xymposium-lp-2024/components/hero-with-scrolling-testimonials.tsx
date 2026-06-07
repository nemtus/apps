import type { JSX } from "react";
import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import { H2, Paragraph } from "@/components/ui/typography";
import AnimatedScrollingTestimonials from "@/components/ui/animated-scrolling-testimonials";
import { StaticImageData } from "next/image";

export interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  data: {
    name: string;
    description: string;
    image: StaticImageData;
  }[];
  className?: string;
}

/**
 * 商品画像等、画面を横に流れるアニメーションつきの説明セクション
 */
export default function HeroWithScrollingTestimonials(props: Props): JSX.Element {
  return (
    <div>
      <AnimatedInViewFadeIn className="flex flex-col gap-6 space-y-6">
        <div className="mx-auto flex flex-col items-center space-y-4 text-center">
          <H2 className="pb-14 text-center">{props.title}</H2>
          {props.description && (
            <Paragraph className="max-w-3xl px-4 text-muted-foreground">{props.description}</Paragraph>
          )}
        </div>
        <div>
          <AnimatedScrollingTestimonials data={props.data} />
        </div>
      </AnimatedInViewFadeIn>
    </div>
  );
}
