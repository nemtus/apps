import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import { Link } from "@/components/ui/link";
import { Paragraph } from "@/components/ui/typography";

export interface Props {
  data: {
    title: string;
    href: string;
    description: string;
  }[];
}

/**
 * 製品等の紹介リンクを一覧で表示する
 */
export default function ProductItemLinks(props: Props): JSX.Element {
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:gap-12 xl:grid-cols-3 xl:gap-16">
      {props.data.map((item, index) => (
        <AnimatedInViewFadeIn className="flex flex-col gap-4 md:gap-6" key={index}>
          <Paragraph className="text-2xl font-bold pb-1">{item.title}</Paragraph>
          <Paragraph className="text-muted-foreground pb-3">{item.description}</Paragraph>
          <div className="mt-auto">
            <Link variant="outline" size="button" href={item.href} target="_blank" rel="noopener">
              More
            </Link>
          </div>
        </AnimatedInViewFadeIn>
      ))}
    </div>
  );
}
