import { Footer } from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import { Paragraph } from "@/components/ui/typography";
import { navigations } from "@/lib/navigations";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Terms: Symbol/NEM Community Xymposium",
  description: "Community Xymposium の利用規約",
};

export default async function IndexPage() {
  return (
    <>
      <section
        id="features"
        className="flex flex-col justify-between gap-6 sm:gap-5 md:gap-10 container max-w-5xl py-8 md:py-12"
      >
        <div className="h-[30]" />
        <div className="h-12" />
        <Paragraph id="term" className="text-3xl font-bold text-center">
          参加規約
        </Paragraph>
        <Paragraph className="font-bold">第1条（適用範囲）</Paragraph>
        <Paragraph>
          本規約は、OSS
          コミュニティ（以下、「主催者」とします）が主催するイベント（以下、「本イベント」とします）に参加するすべての方（以下、「参加者」とします）に適用されます。
        </Paragraph>
        <Paragraph className="font-bold">第2条（個人情報の取り扱い）</Paragraph>
        <Paragraph>
          参加者は、本イベントへの参加にあたり、自己の名前および電子メールアドレス、ブロックチェーンアドレス（以下、「個人情報」とします）を主催者に提供することに同意します。主催者は、これらの情報を本イベントの運営および当日の受付のためにのみ使用し、それ以外の目的で使用することはありません。
          また、提供された個人情報に虚偽が確認された場合は本イベントへの参加を承認しないことがあります。
        </Paragraph>
        <Paragraph className="font-bold">第3条（撮影・投稿の禁止） </Paragraph>
        <Paragraph>
          参加者は、本イベントの内容を写真に撮影したり、その写真を SNS へ登録したりすることを禁止します。
        </Paragraph>
        <Paragraph className="font-bold">第4条（損害の責任）</Paragraph>
        <Paragraph>
          参加者は、本イベントの参加により発生した損害について、主催者が責任を負わないことに同意します。
        </Paragraph>
        <Paragraph className="font-bold">第5条（禁止事項）</Paragraph>
        <Paragraph>
          参加者は、以下の行為を禁止します。禁止事項に抵触した場合、主催者は参加者に対して退場を命じることができます。
        </Paragraph>
        <ol className="list-decimal list-inside pl-3">
          {[
            "法令または公序良俗に違反する行為 犯罪行為に関連する行為",
            "本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為",
            "当社，ほかのユーザー，またはその他第三者のサーバーまたはネットワークの機能を破壊したり，妨害したりする行為",
            "不正アクセスをし，またはこれを試みる行為 他のユーザーに関する個人情報等を収集または蓄積する行為",
            "不正な目的を持って本サービスを利用する行為",
            "本サービスの他のユーザーまたはその他の第三者に不利益，損害，不快感を与える行為 他のユーザーに成りすます行為",
            "当社が許諾しない本サービス上での宣伝，広告，勧誘，または営業行為 面識のない異性との出会いを目的とした行為",
            "当社のサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為",
            "その他，不適切と判断する行為",
            "ブロックチェーン等のトークンの斡旋や買い煽り",
          ].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
        <Paragraph className="font-bold">第6条（建物の利用ルール）</Paragraph>
        <Paragraph>
          参加者は、本イベントが行われる建物の利用ルールについて、Crypto Lounge GOX が定めるルール、
          <Link
            href="https://docs.google.com/document/d/1bgQDBhTig1OIHOo4stSsszFdEp8qiEEpNNfpDvv1iHg/preview"
            target="_blank"
            rel="noopener noreferrer"
          >
            規約
          </Link>
          に従うことに同意します。
        </Paragraph>
        <Paragraph className="font-bold">第7条（規約の改定）</Paragraph>
        <Paragraph>
          主催者は、必要に応じて、本規約を改定することができます。改定された規約は、主催者が別途定める日から効力を生じるものとします。
        </Paragraph>
        <Paragraph className="font-bold">利用規約制定日</Paragraph>
        <Paragraph>2023年 12月 1日</Paragraph>
        <div className="h-32" />
        <Paragraph id="privacy" className="text-3xl font-bold text-center">
          プライバシーポリシー
        </Paragraph>
        <Paragraph className="font-bold">第1条（個人情報の収集と利用目的）</Paragraph>
        <Paragraph>
          本イベントでは、参加者の名前および電子メールアドレスを収集します。これらの個人情報は、本イベントの運営、当日の受付、および参加者への情報提供のためにのみ使用されます。
        </Paragraph>
        <Paragraph className="font-bold">第2条（個人情報の管理）</Paragraph>
        <Paragraph>
          主催者は、収集した個人情報を適切に管理し、第三者に対する漏洩、紛失、破壊、改ざん、不正アクセス等を防止するための適切な安全対策を講じます。
        </Paragraph>
        <Paragraph className="font-bold">第3条（個人情報の第三者提供）</Paragraph>
        <Paragraph>
          主催者は、法令に基づく場合を除き、参加者の個人情報を参加者の同意を得ることなく第三者に提供することはありません。
        </Paragraph>
        <Paragraph className="font-bold">第4条（個人情報の開示・訂正・削除）</Paragraph>
        <Paragraph>
          参加者は、自己の個人情報について、開示、訂正、削除を求めることができます。その場合、主催者は、参加者本人であることを確認した上で、合理的な範囲で速やかに対応します。
        </Paragraph>
        <Paragraph className="font-bold">第5条（クッキー・IPアドレス情報の取扱い）</Paragraph>
        <Paragraph>
          本イベントのウェブサイトでは、サービス向上のため、また統計データとしてクッキーやIPアドレス情報を収集することがありますが、これらは個人を特定するものではありません。
        </Paragraph>
        <Paragraph className="font-bold">第6条（プライバシーポリシーの改定）</Paragraph>
        <Paragraph>
          主催者は、必要に応じて、本プライバシーポリシーを改定することができます。改定されたプライバシーポリシーは、主催者が別途定める日から効力を生じるものとします。
        </Paragraph>
        <Paragraph className="font-bold">プライバシーポリシー制定日</Paragraph>
        <Paragraph>2023年 12月 1日</Paragraph>
        <div className="h-10" />
        <div className="flex flex-row justify-center">
          <Link variant="button" size="button" href={navigations.index}>
            ホームへ戻る
          </Link>
        </div>
        <div className="h-32" />
      </section>
      <section>
        <Footer />
      </section>
    </>
  );
}
