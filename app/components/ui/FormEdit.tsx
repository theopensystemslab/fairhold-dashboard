"use client";
import React from "react";
import { FormFontend } from "@/app/schemas/formSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HouseType } from "../../models/Property";

interface Props {
  formData: FormFontend;
}

const houseTypeDisplayNames: Record<HouseType, string> = {
  D: "Detached",
  S: "Semi-detached",
  T: "Terrace",
  F: "Flat",
};

const FormEdit: React.FC<Props> = ({ formData }) => {
  return (
    <Accordion type="single" collapsible className="inline-block">
      <AccordionItem value="item-1">
        <div className="flex space-x-4 items-center px-2">
          <AccordionTrigger>EDIT</AccordionTrigger>
          <span>{houseTypeDisplayNames[formData.houseType]}</span>
          <span>
            {formData.houseSize} m<sup>2</sup>
          </span>
          <span>{formData.housePostcode}</span>
          <span>{formData.houseAge} years old</span>
          <span>{formData.houseBedrooms} bedrooms</span>
          <span>{formData.maintenancePercentage * 100}% maintenance</span>
        </div>
        <AccordionContent>Redirect to form content...</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FormEdit;
