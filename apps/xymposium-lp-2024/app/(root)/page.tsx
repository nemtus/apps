import HatchetIcon from "@/assets/images/hatchet.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import JaguarIcon from "@/assets/images/hatchet.png";
import OpeningLineIcon from "@/assets/images/openingline.jpg";
import TokyoNodeBanner from "@/assets/tokyo-node-banner.webp";
import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedBorderTrail from "@/components/ui/animated-border-trail";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { H1, H2, H3, Paragraph } from "@/components/ui/typography";
import Image from "next/image";
import AnimatedScrollingTestimonials from "@/components/ui/animated-scrolling-testimonials";

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center justify-center min-h-[80vh] md:min-h-[70vh] lg:min-h-[60vh]">
          <H1 className="text-4xl">
            <span className="text-xl">Symbol/NEM</span>
            <br /> Community Xymposium 2024
          </H1>
          <Paragraph className="max-w-[42rem] text-muted-foreground leading-8">
            Xymposiym 2024のサイドイベントをコミュニティにより開催
          </Paragraph>
          <AnimatedBorderTrail duration="5s" trailSize="lg" className="mt-4">
            <Link variant="ghost" size="buttonLg" href={"/"} aria-disabled className="px-20">
              参加申込み
            </Link>
          </AnimatedBorderTrail>
        </div>
      </section>
      <section
        id="features"
        className="flex flex-col justify-between gap-6 sm:gap-5 md:gap-10 lg:flex-row container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12"
      >
        <div className="flex flex-col justify-center gap-10 lg:py-12 lg:text-left w-full lg:w-5/12 xl:py-24">
          <AnimatedInViewFadeIn>
            <H2 className="text-center lg:text-left">What&lsquo;s in Xymposium?</H2>
            <p className="text-left">
              2024年9月27日に東京ノードにて、Symbol/XYM のイベント &quot;Xymposium 2.0&quot;
              を開催することが発表がされました。 &quot;Xymposium&quot; は
              2023年にも開催され、コアデベロッパーやコミュニティによる多くの取組事例が公表されました。
            </p>
          </AnimatedInViewFadeIn>
        </div>
        <div className="lg:h-auto w-full lg:w-7/12 flex justify-center items-center">
          <AnimatedInViewFadeIn>
            <Image
              loading="eager"
              className="rounded-lg drop-shadow-md"
              src={TokyoNodeBanner}
              alt="Xymposium 2.0 東京ノードバナー"
              width={1024}
            />
          </AnimatedInViewFadeIn>
        </div>
      </section>
      <section id="participant" className="container bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <AnimatedInViewFadeIn className="space-y-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <H2>参加者</H2>
            <Paragraph className="max-w-[85%] text-muted-foreground">
              このイベントでは &quot; Xymposium 2.0 &quot; にあわせて来日する NEM/Symbol
              コア開発者の1人である、ハチェット氏と、来日の意向を表明している数人のコアチームメンバーを招待する他、日々活動しているコミュニティメンバーの来場、企業ブースの出店も予定されています。
            </Paragraph>
          </div>
          <div>
            <AnimatedScrollingTestimonials
              data={[
                {
                  image: HatchetIcon.src,
                  name: "ハチェット",
                  description: "Symbol/NEM コア開発者",
                },
                {
                  image: JaguarIcon.src,
                  name: "ジャガー",
                  description: "Symbol/NEM コア開発者",
                },
                { image: NemtusIcon.src, name: "NEMTUS", description: "NPO法人 NEM技術普及推進会" },
                {
                  image: OpeningLineIcon.src,
                  name: "Opening Line",
                  description: "ブロックチェーンに注力するソフトウェア会社",
                },
              ]}
            />
          </div>
        </AnimatedInViewFadeIn>
      </section>
      <section id="event" className="container py-8 md:py-12 lg:py-24 min-h-[60vh] md:max-w-[64rem]">
        <AnimatedInViewFadeIn className="space-y-10">
          <div>
            <H3 className="py-10">開催概要</H3>
            <div className="mx-auto grid justify-center gap-8 grid-cols-1 sm:grid-cols-2">
              <div>
                <Paragraph className="font-bold">日程</Paragraph>
                <Paragraph>2024年 09月 27日（火）</Paragraph>
              </div>
              <div>
                <Paragraph className="font-bold">時間</Paragraph>
                <Paragraph>19時 00分 〜 22時 00分</Paragraph>
              </div>
              <div>
                <Paragraph className="font-bold">会場</Paragraph>
                <Paragraph>東京都新宿区歌舞伎町2丁目19-15 てなむタウンビル 6F</Paragraph>
                <Link
                  href={"https://cryptoloungegox.com/"}
                  target="_blank"
                  rel="noopener"
                  style={{ textDecoration: "underline" }}
                >
                  Crypto Lounge GOX
                </Link>
              </div>
              <div>
                <Paragraph className="font-bold">参加費</Paragraph>
                <Paragraph>無料</Paragraph>
              </div>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1452653779897!2d139.70233157639942!3d35.69804272904928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d4b4435021b%3A0x486162795e138187!2sCrypto%20Lounge%20GOX!5e0!3m2!1sja!2sjp!4v1698197282425!5m2!1sja!2sjp"
              style={{ border: 0, width: "100%", height: 450 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </AnimatedInViewFadeIn>
      </section>
      <hr />
      <section id="programs" className="sm:container py-20 min-h-[60vh] items-center md:max-w-[64rem]">
        <AnimatedInViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">濃密な時間を過ごしましょう</Paragraph>
          <H2 className="text-center">プログラム</H2>
          <div className="min-h-[50svh] flex justify-center items-center">
            <p className="text-2xl font-semibold text-muted-foreground">Comming Soone</p>
          </div>
          {/* <div className="pt-5">
            <Table className="min-w-[300px]">
              <TableCaption>一部前後、延長する場合がございます</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>time</TableHead>
                  <TableHead>content/speaker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    time: "18:30",
                    speaker: "-",
                    description: "開場",
                  },
                  {
                    time: "19:00",
                    speaker: "NEMTUS理事長 後藤博之",
                    description: "挨拶",
                  },
                  {
                    time: "19:10",
                    speaker: "コア開発者 Hatchet",
                    description: "Xymposium Session",
                  },
                  {
                    time: "20:00",
                    speaker: "コア開発者メンバー",
                    description: "Q&A や他参加者との交流",
                  },
                  {
                    time: "20:30",
                    speaker: "-",
                    description: "歓談",
                  },
                  {
                    time: "22:00",
                    speaker: "-",
                    description: "終了",
                  },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.time}</TableCell>
                    <TableCell>
                      <>
                        <b>{item.description}</b>
                        <br />
                        {item.speaker}
                      </>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div> */}
        </AnimatedInViewFadeIn>
      </section>
      <hr />
      <section
        id="booth"
        className="container space-y-6 py-20 min-h-[60vh]  md:max-w-[64rem] flex flex-col items-stretch"
      >
        <AnimatedInViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">
            気になる企業、チームと交流しましょう
          </Paragraph>
          <H2 className="text-center ml-0 pb-10">出店ブース</H2>
        </AnimatedInViewFadeIn>
        {/* <div className="grid gap-8 sm:grid-cols-2 md:gap-12 xl:grid-cols-3 xl:gap-16">
          {[
            {
              title: "NEMTUS",
              href: "https://nemtus.com",
              description: "日本において「NEM」と「Symbol」技術の普及や発展を促進するNPO法人",
            },
            {
              title: "FOOD NFT",
              href: "https://food-nft.io",
              description: "味覚データをNFT化することで、味のデジタル資産運用を実現します",
            },
            {
              title: "株式会社Opening Line",
              href: "https://www.opening-line.co.jp",
              description: "ブロックチェーンを使ったストレージサービスの Juggle や まちめぐり を提供",
            },
            {
              title: "株式会社Health Care Gate",
              href: "https://healthcaregate.co.jp",
              description: "ブロックチェーンを使った服薬管理アプリ DrugN を提供",
            },
          ].map((item, index) => (
            <AnimatedInViewFadeIn className="flex flex-col gap-4 md:gap-6" key={index}>
              <Paragraph className="text-2xl font-bold pb-1">{item.title}</Paragraph>
              <Paragraph className="text-muted-foreground pb-3">{item.description}</Paragraph>
              <div className="mt-auto">
                <Link variant="outline" size="button" href={item.href}>
                  More
                </Link>
              </div>
            </AnimatedInViewFadeIn>
          ))}
        </div> */}
        <div className="min-h-[50svh] flex justify-center items-center">
          <p className="text-2xl font-semibold text-muted-foreground">Comming Soone</p>
        </div>
      </section>
      <section className="container py-12 md:py-24 max-w-6xl flex flex-col items-center justify-center">
        <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center justify-center min-h-[80vh] md:min-h-[70vh] lg:min-h-[60vh]">
          <H2 className="text-4xl">
            <span className="text-xl">Symbol/NEM</span>
            <br /> Community Xymposium 2024
          </H2>
          <AnimatedBorderTrail duration="5s" trailSize="lg" className="mt-4">
            <Link variant="ghost" size="buttonLg" href={"/"} aria-disabled className="px-20">
              参加申込み
            </Link>
          </AnimatedBorderTrail>
        </div>
      </section>
      <section
        id="questions"
        className="container space-y-6 py-20 min-h-[60vh]  md:max-w-[64rem] flex flex-col items-stretch"
      >
        <H2 className="text-center ml-0">よくある質問</H2>
        <Paragraph className="text-muted-foreground text-center">
          ご不明点がありましたら、support@nemtus.com まで、ご連絡下さい
        </Paragraph>
        <Accordion type="single" collapsible>
          {[
            {
              question: "参加にあたって注意事項はありますか？",
              answer:
                "利用規約をご確認下さい。特に、今回のイベントはSymbo/NEMブロックチェーンに関する情報提供がテーマであり、投資・仮想通貨等の売買に関する知見の共有や、税務相談を目的としたものではありません。また、金融商品セールス、ネットワークビジネス、宗教、政治活動等の勧誘を目的としたご来場はご遠慮ください。会場内にてそのような行為を発見した場合は、ご退場いただく場合があります。",
            },
            {
              question: "東京ノード会場での Xymposium に参加できますか？",
              answer: "イベントの主催者が異なるため、お手数ですが X の Symbol アカウント等からの発表をお待ち下さい。",
            },
            {
              question: "コアチームメンバーの話を聞きたいのですが英語はわかりません。",
              answer:
                "登壇中の資料や説明は英語での説明となってしまいますが、英語を理解出来る日本語メンバーもおりますので、必要に応じて補足説明等を実施致しますので安心してご参加下さい。また、伝えたいメッセージや相談事項がある場合は通訳にて対応致します。",
            },
          ].map((item, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <section className="mt-20">
        <Footer />
      </section>
    </>
  );
}
