import AnimatedBorderTrail from "@/components/ui/animated-border-trail";
import { Link } from "@/components/ui/link";
import TextSpan from "@/components/ui/text-span";
import { H1, Paragraph } from "@/components/ui/typography";

/**
 * サイトトップページの最初のエリア
 */
export default function HeroTitle(): JSX.Element {
  return (
    <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center justify-center min-h-[80vh] md:min-h-[70vh] lg:min-h-[60vh]">
      <H1 className="text-4xl">
        <span className="text-xl">Symbol/NEM</span>
        <br /> Community Xymposium 2024
      </H1>
      <Paragraph className="max-w-3xl text-muted-foreground leading-8">
        <TextSpan>Xymposiym 2024の</TextSpan>
        <TextSpan>サイドイベントを</TextSpan>
        <TextSpan>コミュニティにより開催</TextSpan>
      </Paragraph>
      <AnimatedBorderTrail duration="5s" trailSize="lg" className="mt-4">
        <Link variant="ghost" size="buttonLg" href={"/registration"} aria-disabled className="px-20">
          参加申込み
        </Link>
      </AnimatedBorderTrail>
    </div>
  );
}
