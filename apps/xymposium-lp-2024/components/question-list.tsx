import type { JSX } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface Props {
  data: {
    question: string;
    answer: string;
  }[];
}

/**
 * FAQ 一覧等開けるリスト
 */

export default function QuestionList(props: Props): JSX.Element {
  return (
    <Accordion type="single" collapsible>
      {props.data.map((item, index) => (
        <AccordionItem key={index} value={index.toString()}>
          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
