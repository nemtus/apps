import Image, { StaticImageData } from "next/image";

interface Testimonial {
  name: string;
  image: StaticImageData;
  description: string;
}

interface TestimonialProps {
  data: Testimonial[];
}

function TestimonialCard({ testimonial: { image, name, description } }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-44 w-full overflow-hidden rounded-xl border bg-background dark:border-zinc-700">
      <div className="relative h-full w-32 shrink-0 overflow-hidden">
        <Image loading="lazy" src={image} alt={name} width={100} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-col space-y-4 px-4 py-2">
        <span className="block text-lg font-bold text-foreground">{name}</span>
        <span className="block text-sm text-foreground">{description}</span>
      </div>
    </div>
  );
}

// 参加者は数名のため、横スクロールのマーキーではなくレスポンシブグリッドで全員を
// 1 回ずつ表示する (モバイル 1 列 → sm 以上 2 列)。名前 (Jaguar0625 等) が
// 見切れないよう、横長カードに十分な幅を確保する。
export default function AnimatedScrollingTestimonials({ data }: TestimonialProps) {
  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 px-4 sm:grid-cols-2">
      {data.map((testimonial) => (
        <TestimonialCard key={testimonial.name} testimonial={testimonial} />
      ))}
    </div>
  );
}
