import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import React, { ReactNode } from "react";

interface Props {
  buttonTitle: string;
  title: string;
  description: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const Drawer: React.FC<React.PropsWithChildren<Props>> = ({ 
  buttonTitle, 
  title, 
  description, 
  children, 
  titleClassName = "text-left", 
  descriptionClassName = "text-left" 
}) => (
  <Sheet>
    <SheetTrigger className="text-gray-400 text-xs underline flex">
      <QuestionMarkCircledIcon/>
      <span className="ml-1 pb-6">{buttonTitle}</span>
    </SheetTrigger>
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className={titleClassName}>{ title }</SheetTitle>
        <div className={`text-sm text-muted-foreground ${descriptionClassName}`}>
          { description }
        </div>
        </SheetHeader>
      { children }
    </SheetContent>
  </Sheet>
);