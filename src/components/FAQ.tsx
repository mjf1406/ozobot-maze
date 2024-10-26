import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { pixelifySans } from "~/app/fonts";

export default function FAQ() {
  return (
    <>
      <h2
        className={`text-center text-3xl font-semibold ${pixelifySans.className}`}
      >
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full max-w-2xl">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question #1</AccordionTrigger>
          <AccordionContent>Blah blah blah</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
