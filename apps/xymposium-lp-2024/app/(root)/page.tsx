import GimreIcon from "@/assets/images/gimre.png";
import HatchetIcon from "@/assets/images/hatchet.png";
import JaguarIcon from "@/assets/images/jaguar.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import SymbolBanner from "@/assets/symbol-banner.png";
import SymbolLogo from "@/assets/symbol-logo.png";
import TokyoEditionToranomon from "@/assets/tokyo-edition-toranomon.jpeg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import { H1, H2, H3, Paragraph } from "@/components/ui/typography";
import { navigations } from "@/lib/navigations";
import Image from "next/image";

export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center justify-center min-h-[60vh] md:min-h-[50vh] lg:min-h-[40vh]">
          <H1>Symbol/NEM Xymposium 2023 東京</H1>
          <Paragraph className="max-w-[42rem] text-muted-foreground leading-8">
            コミュニティ向けのイベントとして、 &quot;Community Xymposium&quot;
            を日本のNEM/Symbolコミュニティ有志により開催いたします。
          </Paragraph>
          <Link variant="button" size="button" href={navigations.auth.index}>
            参加登録はこちら
          </Link>
        </div>
      </section>
      <section
        id="features"
        className="flex flex-col justify-between gap-6 sm:gap-5 md:gap-10 lg:flex-row container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12"
      >
        <div className="flex flex-col justify-center text-center md:text-left gap-10 lg:py-12 lg:text-left w-full lg:w-5/12 xl:py-24">
          <H2>What&lsquo;s in Xymposium?</H2>
          <p>
            2023年12月19日（火）に東京エディション虎ノ門において、Symbol/XYM のシンポジウム &quot;Xymposium&quot;
            を開催することが発表がされました。
            このイベントは、ブロックチェーン・クリプト業界関係者向けのイベントとされ、一般のコミュニティ向けのイベントではございません。よって、コミュニティ向けのイベントとして
            &quot;Community Xymposium&quot; を日本のNEM/Symbolコミュニティ有志により開催いたします。
          </p>
        </div>
        <div className="overflow-hidden lg:h-auto w-full lg:w-7/12 flex justify-center items-center">
          <Image
            loading="eager"
            className="rounded-lg shadow-lg animate-in"
            src={TokyoEditionToranomon}
            alt="Xymposium 虎ノ門 2023 バナー"
            width={1024}
          />
        </div>
      </section>
      <section id="participant" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <H2>参加者</H2>
          <Paragraph className="max-w-[85%] text-muted-foreground">
            このイベントでは &quot; Xymposium &quot; にあわせて来日する NEM/Symbol
            コア開発者の1人である、ハチェット氏と、来日の意向を表明している数人のコアチームメンバーを招待する他、日々活動しているコミュニティメンバーの来場も予定されています。
          </Paragraph>
        </div>
        <div className="mx-auto grid justify-center gap-4 grid-cols-1 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>
              <Avatar>
                <AvatarImage src={HatchetIcon.src} />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">ハチェット</CardTitle>
              <CardDescription>Symbol/NEM コア開発者</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>
              <Avatar>
                <AvatarImage src={JaguarIcon.src} />
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">ジャガー</CardTitle>
              <CardDescription>Symbol/NEM コア開発者</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>
              <Avatar>
                <AvatarImage src={GimreIcon.src} />
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">ギムレ</CardTitle>
              <CardDescription>Symbol/NEM コア開発者</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>
              <Avatar>
                <AvatarImage src={NemtusIcon.src} />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">NEMTUS</CardTitle>
              <CardDescription>何か説明</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>icon</CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">Opening Line</CardTitle>
              <CardDescription>何か説明</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between p-2">
            <CardHeader>icon</CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CardTitle className="text-base">その他</CardTitle>
              <CardDescription>何か説明</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="event" className="container space-y-10 py-8 md:py-12 lg:py-24 min-h-[60vh] md:max-w-[64rem]">
        <div>
          <H3 className="py-10">開催概要</H3>
          <div className="mx-auto grid justify-center gap-8 grid-cols-1 sm:grid-cols-2">
            <div>
              <Paragraph className="font-bold">日程</Paragraph>
              <Paragraph>2023年 12月 19日（火）</Paragraph>
            </div>
            <div>
              <Paragraph className="font-bold">時間</Paragraph>
              <Paragraph>19時 30分 〜 21時 30分</Paragraph>
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
              <Paragraph className="text-sm">
                受付にて 100xym 以上の残高を持つ WALLET の アドレス QR コードの提示を必須とします
              </Paragraph>
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
      </section>
      <hr />
      <section id="programs" className="container space-y-6 py-20 min-h-[60vh] space-x-4 items-center md:max-w-[64rem]">
        <Paragraph className="font-semibold text-indigo-500 text-center">メッセージ</Paragraph>
        <H2 className="text-center">プログラム</H2>
        <div className="mx-auto grid justify-center gap-8 grid-cols-1 sm:grid-cols-2">
          {[
            {
              image: SymbolBanner,
              alt: "banner",
              title: "バナー",
              description: "何か説明",
            },
            {
              image: SymbolBanner,
              alt: "banner",
              title: "バナー",
              description: "何か説明",
            },
            {
              image: SymbolBanner,
              alt: "banner",
              title: "バナー",
              description: "何か説明",
            },
            {
              image: SymbolBanner,
              alt: "banner",
              title: "バナー",
              description: "何か説明",
            },
          ].map((item, index) => (
            <Card key={index}>
              <Image loading="lazy" src={item.image} alt={item.description} width={1024} height={300} />
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <hr />
      <section
        id="booth"
        className="container space-y-6 py-20 min-h-[60vh]  md:max-w-[64rem] flex flex-col items-stretch"
      >
        <Paragraph className="font-semibold text-indigo-500 text-center">
          気になる企業、チームと交流しましょう
        </Paragraph>
        <H2 className="text-center ml-0 pb-10">出典ブース</H2>
        <div className="grid gap-8 sm:grid-cols-2 md:gap-12 xl:grid-cols-3 xl:gap-16">
          {[
            {
              image: SymbolLogo,
              alt: "logo",
              title: "Company Name",
              href: "https://google.com",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              image: SymbolLogo,
              alt: "logo",
              title: "Company Name",
              href: "https://google.com",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              image: SymbolLogo,
              alt: "logo",
              title: "Company Name",
              href: "https://google.com",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              image: SymbolLogo,
              alt: "logo",
              title: "Company Name",
              href: "https://google.com",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
          ].map((item, index) => (
            <div className="flex gap-4 md:gap-6" key={index}>
              <div>
                <Image loading="lazy" src={item.image} alt={item.alt} height={100} width={100} />
              </div>
              <div>
                <Paragraph className="text-2xl font-bold pb-1">{item.title}</Paragraph>
                <Paragraph className="text-muted-foreground pb-3">{item.description}</Paragraph>
                <Link variant="button" size="button" href={item.href}>
                  More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        id="questions"
        className="container space-y-6 py-20 min-h-[60vh]  md:max-w-[64rem] flex flex-col items-stretch"
      >
        <H2 className="text-center ml-0">よくある質問</H2>
        <Paragraph className="text-muted-foreground text-center">
          ご不明点がありましたら、**** まで、ご連絡下さい
        </Paragraph>
        {[
          {
            question: "question 1",
            answer: "answer 1",
          },
          {
            question: "question 2",
            answer: "answer 2",
          },
          {
            question: "question 3",
            answer: "answer 3",
          },
          {
            question: "question 4",
            answer: "answer 4",
          },
          {
            question: "question 5",
            answer: "answer 5",
          },
        ].map((item, index) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem value={index.toString()}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}
