import { JSX } from "react";
import AnimatedInViewFadeIn from "@/components/ui/animated-inview-fadein";
import { Link } from "@/components/ui/link";
import TextSpan from "@/components/ui/text-span";
import { H3, Paragraph } from "@/components/ui/typography";

export interface Props {
  title: string;
  tableContents: React.ReactNode[];
  googleMapUrl: string;
}

/**
 * イベント等の住所や地図情報
 */
export default function AddressInfo(props: Props): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <AnimatedInViewFadeIn className="w-full space-y-10">
        <div className="text-left">
          <H3 className="py-14 text-center">{props.title}</H3>
          <div className="mx-auto grid grid-cols-1 justify-center gap-8 sm:grid-cols-2">{props.tableContents}</div>
        </div>
        <div>
          <iframe
            src={props.googleMapUrl}
            style={{ border: 0, width: "100%", height: 450 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </AnimatedInViewFadeIn>
    </div>
  );
}
