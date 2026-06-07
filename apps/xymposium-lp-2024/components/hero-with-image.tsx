import { JSX } from "react";
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
        "container flex flex-col justify-between gap-6 space-y-6 py-8 dark:bg-transparent sm:gap-5 md:gap-10 md:py-12 lg:flex-row",
        props.className,
      )}
    >
      <div className="w-full lg:w-5/12 lg:py-12 xl:py-24">
        <AnimatedInViewFadeIn>
          <div className="flex flex-col items-center justify-stretch">
            <H2 className="pb-14 text-center lg:text-left">{props.title}</H2>
            <p className="text-left text-muted-foreground md:max-w-3xl md:text-center lg:max-w-none lg:text-left">
              {props.description}
            </p>
          </div>
        </AnimatedInViewFadeIn>
      </div>
      <div className="flex w-full items-center justify-center lg:h-auto lg:w-7/12">
        <AnimatedInViewFadeIn>
          {props.imageHref ? (
            <Link href={props.imageHref} target="_blank" rel="noopener noreferrer">
              <Image
                loading="lazy"
                className="cursor-pointer rounded-lg drop-shadow-md transition-transform duration-500 hover:scale-105"
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
