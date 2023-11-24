import HatchetIcon from "@/assets/images/hatchet.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import OpeningLineIcon from "@/assets/images/openingline.jpg";
import TokyoEditionToranomon from "@/assets/tokyo-edition-toranomon.jpeg";
import InViewFadeIn from "@/components/atom/moleculs/inview-fadein";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            コミュニティ向けのイベント &quot;Community Xymposium&quot; を日本の NEM/Symbol
            コミュニティ有志により開催いたします。
          </Paragraph>
          <Link variant="button" size="button" href={navigations.registration.index}>
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
            を開催することが発表がされました。 こちらのコミュニティ向けのサイドイベントとして &quot;Community
            Xymposium&quot; を開催し、Symbol/NEM の今とこれからをお届け致します。
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
      <section id="participant" className="container bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <InViewFadeIn className="space-y-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <H2>参加者</H2>
            <Paragraph className="max-w-[85%] text-muted-foreground">
              このイベントでは &quot; Xymposium &quot; にあわせて来日する NEM/Symbol
              コア開発者の1人である、ハチェット氏と、来日の意向を表明している数人のコアチームメンバーを招待する他、日々活動しているコミュニティメンバーの来場、企業ブースの出店も予定されています。
            </Paragraph>
          </div>
          <div className="mx-auto grid justify-center gap-4 grid-cols-1 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {[
              {
                image: HatchetIcon.src,
                imageFallback: "H",
                name: "ハチェット",
                description: "Symbol/NEM コア開発者",
              },
              // {
              //   image: JaguarIcon.src,
              //   imageFallback: "J",
              //   name: "ジャガー",
              //   description: "Symbol/NEM コア開発者",
              // },
              // {
              //   image: GimreIcon.src,
              //   imageFallback: "G",
              //   name: "ギムレ",
              //   description: "Symbol/NEM コア開発者",
              // },
              {
                image: NemtusIcon.src,
                imageFallback: "N",
                name: "NEMTUS",
                description: "NPO法人 NEM技術普及推進会",
              },
              {
                image: OpeningLineIcon.src,
                imageFallback: "O",
                name: "Opening Line",
                description: "ブロックチェーンに注力するソフトウェア会社",
              },
            ].map((item, index) => (
              <Card className="flex flex-col justify-between p-2" key={index}>
                <CardHeader>
                  <Avatar>
                    <AvatarImage src={item.image} />
                    <AvatarFallback>{item.imageFallback}</AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </InViewFadeIn>
      </section>
      <section id="event" className="container py-8 md:py-12 lg:py-24 min-h-[60vh] md:max-w-[64rem]">
        <InViewFadeIn className="space-y-10">
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
        </InViewFadeIn>
      </section>
      <hr />
      <section id="programs" className="sm:container py-20 min-h-[60vh] items-center md:max-w-[64rem]">
        <InViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">濃密な時間を過ごしましょう</Paragraph>
          <H2 className="text-center">プログラム</H2>
          <div className="pt-5">
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
                    time: "19:30",
                    speaker: "-",
                    description: "開場",
                  },
                  {
                    time: "19:50",
                    speaker: "NEMTUS理事長 後藤博之",
                    description: "開場",
                  },
                  {
                    time: "20:00",
                    speaker: "コア開発者 Hatchet",
                    description: "Xymposium session",
                  },
                  {
                    time: "20:30",
                    speaker: "コア開発者メンバー",
                    description: "Q&A",
                  },
                  {
                    time: "21:30",
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
          </div>
        </InViewFadeIn>
      </section>
      <hr />
      <section
        id="booth"
        className="container space-y-6 py-20 min-h-[60vh]  md:max-w-[64rem] flex flex-col items-stretch"
      >
        <InViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">
            気になる企業、チームと交流しましょう
          </Paragraph>
          <H2 className="text-center ml-0 pb-10">出店ブース</H2>
        </InViewFadeIn>
        <div className="grid gap-8 sm:grid-cols-2 md:gap-12 xl:grid-cols-3 xl:gap-16">
          {[
            {
              title: "NEMTUS",
              href: "https://nemtus.com",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              title: "HertLog",
              href: "https://nftdrive.net",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              title: "FOOD NFT",
              href: "https://food-nft.io",
              description: "Filler text is dummy text which has no meaning however looks very similar to real text.",
            },
            {
              title: "合同会社パレットリンク沖縄",
              href: "https://plo.llc",
              description: "NFT 次世代写真館 UMUI を提供",
            },
            {
              title: "株式会社NFT Drive",
              href: "https://nftdrive.net",
              description: "-",
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
            {
              title: "ぶどう株式会社",
              href: "https://grape.ne.jp/jpn/",
              description:
                "ブロックチェーンを使った名刺の ブロックチェーンビジネスカードや バーチャルカードトークンつくーるを提供",
            },
            {
              title: "SandwichFactory",
              href: "http://www.sandwich-f.com",
              description: "-",
            },
            {
              title: "22Cafe",
              href: "https://www.22-cafe.com",
              description: "-",
            },
            {
              title: "CANADE",
              href: "https://www.canade.shop",
              description: "-",
            },
          ].map((item, index) => (
            <InViewFadeIn className="flex flex-col gap-4 md:gap-6" key={index}>
              <Paragraph className="text-2xl font-bold pb-1">{item.title}</Paragraph>
              <Paragraph className="text-muted-foreground pb-3">{item.description}</Paragraph>
              <div className="mt-auto">
                <Link variant="outline" size="button" href={item.href}>
                  More
                </Link>
              </div>
            </InViewFadeIn>
          ))}
        </div>
      </section>
      <section className="container py-12 md:py-24 max-w-6xl flex flex-col items-center justify-center">
        <h3 className="background-animate font-extrabold text-4xl md:text-6xl bg-clip-text bg-gradient-to-r from-[#7C3AED] via-emerald-500 to-sky-500 text-transparent text-center p-5 mb-4 leading-none text-gray-900">
          Symbol/NEM Community Xymposium
        </h3>
        <Link variant="button" size="button" href={navigations.registration.index}>
          参加登録はこちら
        </Link>
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
              question: "参加に条件はありますか？",
              answer:
                "Xymposium はSymbol/NEMホルダー、ファンのためのシンポジウムであることから、SymbolウォレットとNEMウォレットをお持ちの方とさせていただきます。また、当日参加された方へご登録いただいたSymbolウォレットに入場券となる『チケットNFT』を送信させていただきます。",
            },
            {
              question: "東京エディション虎ノ門会場での Xymposium に参加できますか？",
              answer:
                "Xymposium はSymbol/NEMホルダー、ファンのためのシンポジウムであることから、SymbolウォレットとNEMウォレットをお持ちの方とさせていただきます。また、当日参加された方へご登録いただいたSymbolウォレットに入場券となる『チケットNFT』を送信させていただきます。",
            },
            {
              question: "参加条件である 100xym の保有は取引所アカウントでも良いですか？",
              answer:
                "受付の際に 100xym を保有するアカウントを登録した WALLET でアドレスの QR コードを提示頂く必要があります。 QR コードの提示が出来ない場合、参加頂く事が出来ません。",
            },
            {
              question: "Metamaskは使えますか？",
              answer: "Symbol ブロックチェーンは Metamask に対応しておらず、利用頂けません。",
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
