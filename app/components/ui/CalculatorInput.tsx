"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";
import { formSchema, FormFrontend } from "@/app/schemas/formSchema";
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

type View = "form" | "loading" | "dashboard";

const CalculatorInput = () => {
  const [view, setView] = useState<View>("form");
  const [data, setData] = useState<Household | null>(null);

  const searchParams = useSearchParams();
  const urlPostcode = searchParams.get("postcode");
  const urlHouseSize = searchParams.get("houseSize");
  const urlHouseAge = searchParams.get("houseAge");
  const urlHouseBedrooms = searchParams.get("houseBedrooms");
  const urlHouseType = searchParams.get("houseType");
  const urlMaintenancePercentage = searchParams.get("maintenancePercentage");

  const form = useForm<FormFrontend>({
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
      // Apply defaults if provided
      // Type-safe to account for exactOptionalPropertyTypes propert in tsconfig.json
      ...(urlHouseSize && { houseSize: Number(urlHouseSize) }),
      ...(urlHouseAge && { houseAge: Number(urlHouseAge) }),
      ...(urlHouseBedrooms && { houseBedrooms: Number(urlHouseBedrooms) }),
    },
  });

  const onSubmit = async (data: FormFrontend) => {
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
      <div className="flex flex-col justify-center max-w-xl mx-auto px-10">
        <div className="h1-style">
          Calculate how Fairhold could work for you
        </div>
        <div className="subheadstyle">
          Compare the estimated cost of a Fairhold home in your area with other
          ways of owning or renting.
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="houseType" // Name in the Calculation schema for the new radio field
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h3-style">House type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)} // Bind selection to field
                      className="flex space-x-auto"
                    >
                      <div className="flex items-center space-x-2 ">
                        <RadioGroupItem
                          value="D"
                          id="radio-option-D"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-D"
                          className="radio-label-style"
                        >
                          Detached{" "}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="S"
                          id="radio-option-S"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-S"
                          className="radio-label-style"
                        >
                          Semi detached
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="T"
                          id="radio-option-T"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-T"
                          className="radio-label-style"
                        >
                          Terrace
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="F"
                          id="radio-option-F"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-F"
                          className="radio-label-style"
                        >
                          Flat
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="housePostcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="h3-style">Postcode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SE17 1PE"
                        {...field}
                        className="inputfield-style"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="h3-style">
                      How big is the house?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 80 for 80 square meters"
                        {...field}
                        value={field.value ?? ""}
                        className="inputfield-style"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="h3-style">
                      How old is the building?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 1 for a new house"
                        {...field}
                        value={field.value ?? ""}
                        className="inputfield-style"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseBedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="h3-style">
                      Number of bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=" e.g. 2 for twp bedrooms"
                        {...field}
                        value={field.value ?? ""}
                        className="inputfield-style"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maintenancePercentage" // Name in the Calculation schema for the new radio field
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h3-style">
                    How much will you spend on maintenance and improvements?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={String(field.value)} // Convert number to string for RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))} // Convert back to number for form
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="0.015"
                          id="radio-option-low"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-low"
                          className="radio-label-style"
                        >
                          Low (1.5%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="0.02"
                          id="radio-option-medium"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-medium"
                          className="radio-label-style"
                        >
                          Medium (2%)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="0.0375"
                          id="radio-option-high"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-high"
                          className="radio-label-style"
                        >
                          High (3.75%)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>What is this?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="h3-style inaccessible-input-style">
                  Mortgage interest rate
                </span>
                <span className="inaccessible-input-style">6%</span>
              </div>
              <div className="flex flex-col">
                <span className="h3-style inaccessible-input-style">
                  Mortgage term
                </span>
                <span className="inaccessible-input-style">25 years</span>
              </div>
              <div className="flex flex-col">
                <span className="h3-style inaccessible-input-style">
                  Mortgage deposit
                </span>
                <span className="inaccessible-input-style">25 years</span>
              </div>
            </div>

            <Button type="submit" className="calculate-button-style">
              Calculate
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-black mt-5">
        <ClipLoader color="black" size={50} />
      </div>
    );
  } else if (view === "dashboard" && data) {
    const formValues = form.getValues();
    return <Dashboard processedData={data} inputData={formValues} />;
  }
};

export default CalculatorInput;
