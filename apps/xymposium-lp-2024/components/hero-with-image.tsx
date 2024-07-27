import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import { H2 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

export interface Props {
  title: React.ReactNode;
  image: StaticImageData;
  imageAlt?: string;
  imageWidth?: number;
  imageHref?: string;
  description?: React.ReactNode;
  className?: string;
}

/**
 * サイトトップ等で使用する タイトル + 画像で2分割されたセクション
 */
export default function HeroWithImage(props: Props): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-6 sm:gap-5 md:gap-10 lg:flex-row container space-y-6 py-8 dark:bg-transparent md:py-12",
        props.className
      )}
    >
      <div className="w-full lg:py-12 lg:w-5/12 xl:py-24">
        <AnimatedInViewFadeIn>
          <div className="flex flex-col justify-stretch items-center">
            <H2 className="text-center pb-14 lg:text-left">{props.title}</H2>
            <p className="text-left text-muted-foreground md:max-w-3xl md:text-center lg:max-w-none lg:text-left">
              {props.description}
            </p>
          </div>
        </AnimatedInViewFadeIn>
      </div>
      <div className="lg:h-auto w-full lg:w-7/12 flex justify-center items-center">
        <AnimatedInViewFadeIn>
          {props.imageHref ? (
            <Link href={props.imageHref} target="_blank" rel="noopener noreferrer">
              <Image
                loading="lazy"
                className="rounded-lg drop-shadow-md hover:scale-105 transition-transform duration-500 cursor-pointer"
                src={props.image}
                alt={props.imageAlt ?? "hero image"}
                width={props.imageWidth ?? 1024}
              />
            </Link>
          ) : (
            <Image
              loading="lazy"
              className="rounded-lg drop-shadow-md"
              src={props.image}
              alt={props.imageAlt ?? "hero image"}
              width={props.imageWidth ?? 1024}
            />
          )}
        </AnimatedInViewFadeIn>
      </div>
    </div>
  );
}
