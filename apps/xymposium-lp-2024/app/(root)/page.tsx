import HatchetIcon from "@/assets/images/hatchet.png";
import NemtusIcon from "@/assets/images/nemtus.png";
import JaguarIcon from "@/assets/images/jaguar.png";
import OpeningLineIcon from "@/assets/images/openingline.jpg";
import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import AnimatedBorderTrail from "@/components/ui/animated-border-trail";
import { Footer } from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import { H2, Paragraph } from "@/components/ui/typography";
import HeroTitle from "@/components/hero-title";
import HeroWithImage from "@/components/hero-with-image";
import TokyoNodeBanner from "@/assets/tokyo-node-banner.webp";
import HeroWithScrollingTestimonials from "@/components/hero-with-scrolling-testimonials";
import AddressInfo from "@/components/address-info";
import TextSpan from "@/components/ui/text-span";
import TimeTable from "@/components/time-table";
import ProductItemLinks from "@/components/product-items";
import QuestionList from "@/components/question-list";

export default async function IndexPage() {
  return (
    <>
      <section className="py-8 md:py-12 lg:py-32">
        <HeroTitle />
      </section>
      <section id="features" className="py-4 md:py-6 bg-slate-50">
        <HeroWithImage
          title="What’s in Xymposium?"
          image={TokyoNodeBanner}
          imageAlt="Xymposium 2.0 東京ノードバナー"
          imageHref="https://x.com/thesymbolchain/status/1806128907680399867"
          description='東京ノードにて、Symbol/XYM のイベント "Xymposium 2.0" を2024年9月27日に開催することが発表がされました。 "Xymposium" は 2023年にも開催され、コアデベロッパーやコミュニティによる多くの取組事例が公表されました。'
        />
      </section>
      <section id="participant" className="bg-slate-50 py-4 md:py-6">
        <HeroWithScrollingTestimonials
          title="参加者"
          description='このイベントでは " Xymposium 2.0 " にあわせて来日する NEM/Symbol コア開発者の1人である、ハチェット氏と、来日の意向を表明している数人のコアチームメンバーを招待する他、日々活動しているコミュニティメンバーの来場、企業ブースの出店も予定されています。'
          data={[
            {
              image: HatchetIcon,
              name: "ハチェット",
              description: "Symbol/NEM コア開発者",
            },
            {
              image: JaguarIcon,
              name: "ジャガー",
              description: "Symbol/NEM コア開発者",
            },
            { image: NemtusIcon, name: "NEMTUS", description: "NPO法人 NEM技術普及推進会" },
            {
              image: OpeningLineIcon,
              name: "Opening Line",
              description: "ブロックチェーンに注力するソフトウェア会社",
            },
          ]}
        />
      </section>
      <section id="event" className="container py-4 md:py-6">
        <AddressInfo
          googleMapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1452653779897!2d139.70233157639942!3d35.69804272904928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d4b4435021b%3A0x486162795e138187!2sCrypto%20Lounge%20GOX!5e0!3m2!1sja!2sjp!4v1698197282425!5m2!1sja!2sjp"
          title="開催概要"
          tableContents={[
            <div key={0}>
              <Paragraph className="font-bold">日程</Paragraph>
              <Paragraph>2024年 09月 27日（金）</Paragraph>
            </div>,
            <div key={1}>
              <Paragraph className="font-bold">時間</Paragraph>
              <Paragraph>19時 00分 〜 22時 00分</Paragraph>
            </div>,
            <div key={2}>
              <Paragraph className="font-bold">会場</Paragraph>
              <Paragraph>
                東京都新宿区歌舞伎町2丁目19-15 <TextSpan>てなむタウンビル 6F</TextSpan>
              </Paragraph>
              <Link
                href={"https://cryptoloungegox.com/"}
                target="_blank"
                rel="noopener"
                style={{ textDecoration: "underline" }}
              >
                Crypto Lounge GOX
              </Link>
            </div>,
            <div key={3}>
              <Paragraph className="font-bold">参加費</Paragraph>
              <Paragraph>無料</Paragraph>
            </div>,
          ]}
        />
      </section>
      <hr />
      <section id="programs" className="sm:container py-8 md:py-12 items-center md:max-w-6xl">
        <AnimatedInViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">濃密な時間を過ごしましょう</Paragraph>
          <H2 className="text-center">プログラム</H2>
          <TimeTable
            caption="一部前後、延長する場合がございます"
            data={[
              {
                time: "18:30",
                description: "-",
                title: "開場",
              },
              {
                time: "19:00",
                description: "NEMTUS理事長 後藤博之",
                title: "挨拶",
              },
              {
                time: "19:10",
                description: "コア開発者 Hatchet",
                title: "Xymposium Session",
              },
              {
                time: "20:00",
                description: "コア開発者メンバー",
                title: "Q&A や他参加者との交流",
              },
              {
                time: "20:30",
                description: "-",
                title: "歓談",
              },
              {
                time: "22:00",
                description: "-",
                title: "終了",
              },
            ]}
          />
        </AnimatedInViewFadeIn>
      </section>
      <hr />
      <section id="booth" className="container space-y-6 py-8 md:py-12 max-w-6xl flex flex-col items-stretch">
        <AnimatedInViewFadeIn className="space-y-6">
          <Paragraph className="font-semibold text-indigo-500 text-center">
            気になる企業、チームと交流しましょう
          </Paragraph>
          <H2 className="text-center ml-0 pb-10">出店ブース</H2>
          <ProductItemLinks
            data={[
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
                title: "株式会社 Opening Line",
                href: "https://www.opening-line.co.jp",
                description: "ブロックチェーンを使ったストレージサービスの Juggle や まちめぐり を提供",
              },
              {
                title: "株式会社 Health Care Gate",
                href: "https://healthcaregate.co.jp",
                description: "ブロックチェーンを使った服薬管理アプリ DrugN を提供",
              },
            ]}
          />
        </AnimatedInViewFadeIn>
      </section>
      <section className="container py-12 md:py-24 max-w-6xl flex flex-col items-center justify-center">
        <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center justify-center min-h-[80vh] md:min-h-[70vh] lg:min-h-[60vh]">
          <H2 className="text-4xl">
            <span className="text-xl">Symbol/NEM</span>
            <br /> Community Xymposium 2024
          </H2>
          <AnimatedBorderTrail duration="5s" trailSize="lg" className="mt-4">
            <Link variant="ghost" size="buttonLg" href={"/registration"} aria-disabled className="px-20">
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
          ご不明点がありましたら
          <Link className="px-1" href="mailto:support@nemtus.com">
            support@nemtus.com
          </Link>
          まで、ご連絡下さい
        </Paragraph>
        <QuestionList
          data={[
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
          ]}
        />
      </section>
      <section className="mt-20">
        <Footer />
      </section>
    </>
  );
}
