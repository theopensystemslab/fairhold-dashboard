"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";
import { formSchema, formType } from "@/app/schemas/formSchema";
import { useSearchParams } from "next/navigation";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipLoader } from "react-spinners";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculatorInput = () => {
  const [view, setView] = useState("form");
  const [data, setData] = useState<Household | null>(null);

  const searchParams = useSearchParams();
  const urlPostcode = searchParams.get("postcode");
  const urlHouseSize = searchParams.get("houseSize");
  const urlHouseAge = searchParams.get("houseAge");
  const urlHouseBedrooms = searchParams.get("houseBedrooms");
  const urlHouseType = searchParams.get("houseType");
  const urlMaintenancePercentage = searchParams.get("maintenancePercentage");

  const methods = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseType:
        urlHouseType === "D" ||
        urlHouseType === "F" ||
        urlHouseType === "T" ||
        urlHouseType === "S"
          ? urlHouseType
          : "D", // Default value for house type
      maintenancePercentage: [0.015, 0.02, 0.0375].includes(
        Number(urlMaintenancePercentage)
      )
        ? (Number(urlMaintenancePercentage) as 0.015 | 0.02 | 0.0375) // Type assertion
        : 0.015,
      housePostcode: urlPostcode || "",
      houseSize: Number(urlHouseSize) || undefined,
      houseAge: Number(urlHouseAge) || undefined,
      houseBedrooms: Number(urlHouseBedrooms) || undefined,
    },
  });

  const onSubmit = async (data: formType) => {
    setView("loading");
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const processedData = await response.json();
    setData(processedData);
    setView("dashboard");
  };

  if (view === "form") {
    return (
      <div className="flex items-center justify-center text-black mt-5">
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={methods.control}
              name="housePostcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property postcode</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the property postcode, e.g. SE17 1PE"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Postcode of the property.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="houseSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House size</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the house size in square meters, e.g. 80"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>The size of the house.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="houseAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House age</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the house age, e.g. 1 for a new house"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>How old is the house.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="houseBedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the number of bedrooms in the house, e.g. 2"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    How many bedrooms in the house.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="houseType" // Name in the Calculation schema for the new radio field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>House type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)} // Bind selection to field
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="D" id="radio-option-D" />
                        <Label htmlFor="radio-option-D">Detached</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="S" id="radio-option-S" />
                        <Label htmlFor="radio-option-S">Semi detached</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="T" id="radio-option-T" />
                        <Label htmlFor="radio-option-T">Terrace</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="radio-option-F" />
                        <Label htmlFor="radio-option-F">Flat</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select an option for the house type.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="maintenancePercentage" // Name in the Calculation schema for the new radio field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance spend percentage</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={String(field.value)} // Convert number to string for RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))} // Convert back to number for form
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0.015" id="radio-option-low" />
                        <Label htmlFor="radio-option-low">Low (1.5%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0.02" id="radio-option-medium" />
                        <Label htmlFor="radio-option-medium">Medium (2%)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0.0375" id="radio-option-high" />
                        <Label htmlFor="radio-option-high">High (3.75%)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select a level for maintenance spend, as a percentage of
                    house cost.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    );
  } else if (view === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-black mt-5">
        <ClipLoader color="black" size={50} />
      </div>
    );
  } else if (view === "dashboard") {
    return <Dashboard data={data as Household} />;
  }
};

export default CalculatorInput;
