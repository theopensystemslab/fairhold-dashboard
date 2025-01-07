"use client";
import React from "react";
import { formType } from "@/app/schemas/formSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HouseType } from "../../models/Property";

interface Props {
  formData: formType;
}

function mapHouseType(houseType: HouseType) {
  if (houseType === "D") {
    return "Detached";
  }

  if (houseType === "S") {
    return "Semi-detached";
  }

  if (houseType === "T") {
    return "Terrace";
  }

  if (houseType === "F") {
    return "Flat";
  }
}

const FormEdit: React.FC<Props> = ({ formData }) => {
  return (
    <Accordion type="single" collapsible className="inline-block">
      <AccordionItem value="item-1">
        <div className="flex space-x-4 items-center px-2">
          <AccordionTrigger>EDIT</AccordionTrigger>
          <span>{mapHouseType(formData.houseType)}</span>
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
