import Marquee from "@/components/ui/animated-marquee";
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
    <div className="flex h-44 w-96 overflow-hidden rounded-xl border bg-background dark:border-zinc-700" key={name}>
      <div className="relative h-full w-32 flex-shrink-0 overflow-hidden">
        <Image loading="lazy" src={image} alt={name} width={100} className="h-full w-full object-contain" />
      </div>
      <div className="px-4 py-2 flex flex-col space-y-4">
        <span className="block text-lg font-bold text-foreground">{name}</span>
        <span className="block text-sm text-foreground">{description} </span>
      </div>
    </div>
  );
}

export default function AnimatedScrollingTestimonials({ data }: TestimonialProps) {
  return (
    <div className="w-full">
      <Marquee className="[--duration:25s]" pauseOnHover applyMask={false}>
        {data.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </Marquee>

      <Marquee reverse className="[--duration:25s]" pauseOnHover applyMask={false}>
        {data.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </Marquee>

      <Marquee className="[--duration:25s]" pauseOnHover applyMask={false}>
        {data.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </Marquee>
    </div>
  );
}
