"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";
import { formSchema, FormFrontend } from "@/app/schemas/formSchema";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_INTEREST_RATE,
  DEFAULT_MORTGAGE_TERM,
  DEFAULT_INITIAL_DEPOSIT,
  MAINTENANCE_LEVELS,
} from "../../models/constants";
import { MaintenanceLevel } from "../../models/constants";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ClipLoader } from "react-spinners";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APIError } from "@/app/lib/exceptions";
import { BackgroundAssumptions } from "./BackgroundAssumptions";
import { MaintenanceExplainerDrawer } from "./MaintenanceExplainerDrawer";
import InputDropdown from "./InputDropdown";

type View = "form" | "loading" | "dashboard";

const CalculatorInput = () => {
  const [view, setView] = useState<View>("form");
  const [data, setData] = useState<Household | null>(null);

  const searchParams = useSearchParams();
  const urlPostcode = searchParams.get("postcode");
  const urlHouseAge = searchParams.get("houseAge");
  const urlHouseBedrooms = searchParams.get("houseBedrooms");
  const urlHouseType = searchParams.get("houseType");
  const urlMaintenanceLevel = searchParams.get("maintenancePercentage");

  const AGE_OPTIONS = [
    { label: "New", value: 0 },
    { label: "2020s", value: 3 },
    { label: "2010s", value: 12 },
    { label: "2000s", value: 22 },
    { label: "1990s", value: 32 },
    { label: "1980s", value: 42 },
    { label: "1970s", value: 52 },
    { label: "1960s", value: 62 },
    { label: "1950s", value: 72 },
    { label: "Pre-war", value: 88 },
    { label: "Pre-1900", value: 130 },
  ] as const;

  const form = useForm<FormFrontend>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseType:
        urlHouseType === "D" ||
        urlHouseType === "F" ||
        urlHouseType === "T" ||
        urlHouseType === "S"
          ? urlHouseType
          : "F", // Default value for house type
      maintenanceLevel:
        urlMaintenanceLevel && urlMaintenanceLevel in MAINTENANCE_LEVELS
          ? (urlMaintenanceLevel as MaintenanceLevel)
          : "low",
      housePostcode: urlPostcode || "",
      // Apply defaults if provided
      // Type-safe to account for exactOptionalPropertyTypes propert in tsconfig.json
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
    if (!response.ok) return handleErrors(processedData.error);

    setData(processedData);
    setView("dashboard");
  };

  const handleErrors = (error: APIError) => {
    switch (error.code) {
      case "ITL3_NOT_FOUND":
      case "INSUFFICIENT_PRICES_PAID_DATA":
        form.setError("housePostcode", {
          message:
            "Insufficient data for this postcode. Please try again with a different postcode",
        });
        break;
      case "UNHANDLED_EXCEPTION":
      default:
        console.error(error);
    }

    setView("form");
  };

  if (view === "form") {
    return (
      <div className="flex flex-col justify-center max-w-2xl mx-auto px-10">
        <div className="h1-style text-lg md:text-xl lg:text-2xl">
          Calculate how Fairhold could work for you
        </div>
        <div className="subheadstyle text-sm  md:text-base">
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
                  <FormLabel className="h3-style text-sm lg:text-base ">
                    House type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)} // Bind selection to field
                      className="grid grid-cols-2 md:flex md:space-x-auto"
                    >
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
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="housePostcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="h3-style text-sm lg:text-base ">
                      Postcode
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. SE17 1PE"
                        {...field}
                        className="inputfield-style text-xs"
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
                    <FormLabel className="h3-style text-sm lg:text-base">
                      When was the house built?
                    </FormLabel>
                    <FormControl>
                      <InputDropdown
                        value={field.value}
                        onValueChange={field.onChange}
                        options={AGE_OPTIONS}
                        placeholder="Select house age"
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
                    <FormLabel className="h3-style text-sm lg:text-base">
                      Number of bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=" e.g. 2 for two bedrooms"
                        {...field}
                        value={field.value ?? ""}
                        className="inputfield-style text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maintenanceLevel" // Name in the Calculation schema for the new radio field
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h3-style text-sm lg:text-base">
                    How much will you spend on maintenance and improvements?
                  </FormLabel>

                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col space-y-2" 
                      >
                      <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="none"
                        id="radio-option-none"
                        className="radio-button-style"
                      />
                      <Label
                        htmlFor="radio-option-none"
                        className="radio-label-style"
                      >
                        None (0%) 
                          <div className="mt-1 text-[rgb(var(--text-inaccessible-rgb))]">
                          I will not carry out any maintenance work.
                          </div>
                      </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="low"
                          id="radio-option-low"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-low"
                          className="radio-label-style"
                        >
                          Low ({MAINTENANCE_LEVELS.low * 100}%) 
                            <div className="mt-1 text-[rgb(var(--text-inaccessible-rgb))]">
                            I will spend the minimum to keep my home habitable, carrying out essential repairs only.
                            </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="medium"
                          id="radio-option-medium"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-medium"
                          className="radio-label-style"
                        >
                          Medium ({MAINTENANCE_LEVELS.medium * 100}%)
                          <div className="mt-1 text-[rgb(var(--text-inaccessible-rgb))]">
                          I will maintain my home to a good standard, redecorating occasionally and replacing elements like kitchens and bathrooms periodically.
                            </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="high"
                          id="radio-option-high"
                          className="radio-button-style"
                        />
                        <Label
                          htmlFor="radio-option-high"
                          className="radio-label-style"
                        >
                          High ({MAINTENANCE_LEVELS.high * 100}%)
                          <div className="mt-1 text-[rgb(var(--text-inaccessible-rgb))]">
                          I will maintain my home to a good standard and invest in improvements such as energy retrofit or a new extension.
                            </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <MaintenanceExplainerDrawer />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="font-bold text-xs inaccessible-input-style">
                  Mortgage interest rate
                </span>
                <span className="inaccessible-input-style text-xs">
                  {DEFAULT_INTEREST_RATE * 100}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold inaccessible-input-style">
                  Mortgage term
                </span>
                <span className="inaccessible-input-style text-xs">
                  {DEFAULT_MORTGAGE_TERM} years
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold inaccessible-input-style">
                  Mortgage deposit
                </span>
                <span className="inaccessible-input-style text-xs">
                  {DEFAULT_INITIAL_DEPOSIT * 100}%
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="calculate-button-style px-10 md:px-20"
            >
              Calculate
            </Button>
          </form>
        </Form>
        <hr className="my-8 text-gray-300" />
        <BackgroundAssumptions />
      </div>
    );
  }

  if (view === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-black mt-5">
        <ClipLoader color="black" size={50} />
      </div>
    );
  }

  if (view === "dashboard" && data) {
    const formValues = form.getValues();
    return <Dashboard processedData={data} inputData={formValues} />;
  }
};

export default CalculatorInput;
