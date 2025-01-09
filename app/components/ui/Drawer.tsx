import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import React from "react";

interface Props {
  buttonTitle: string;
  title: string;
  description: string;
}

export const Drawer: React.FC<React.PropsWithChildren<Props>> = ({ buttonTitle, title, description, children }) => (
  <Sheet>
    <SheetTrigger className="text-gray-400 text-xs underline flex">
      <QuestionMarkCircledIcon/>
      <span className="ml-1">{buttonTitle}</span>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{ title }</SheetTitle>
        <SheetDescription>{ description }</SheetDescription>
      </SheetHeader>
      { children }
    </SheetContent>
  </Sheet>
);