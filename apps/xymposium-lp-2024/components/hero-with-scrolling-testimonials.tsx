import HatchetIcon from "@/assets/images/hatchet.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import JaguarIcon from "@/assets/images/hatchet.png";
import OpeningLineIcon from "@/assets/images/openingline.jpg";
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
          <H2 className="text-center pb-14">{props.title}</H2>
          {props.description && <Paragraph className="max-w-3xl text-muted-foreground">{props.description}</Paragraph>}
        </div>
        <div>
          <AnimatedScrollingTestimonials data={props.data} />
        </div>
      </AnimatedInViewFadeIn>
    </div>
  );
}
