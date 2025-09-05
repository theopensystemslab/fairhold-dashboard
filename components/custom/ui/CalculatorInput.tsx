"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormFrontend } from "@schemas/formSchema";
import { useSearchParams } from "next/navigation";
import {
  DEFAULT_INTEREST_RATE,
  DEFAULT_MORTGAGE_TERM,
  DEFAULT_INITIAL_DEPOSIT,
  MAINTENANCE_LEVELS,
} from "@models/constants";
import { MaintenanceLevel } from "@models/constants";

import { RadioGroup, RadioGroupItem } from "@components/radio-group";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@components/form";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Label } from "@components/label";
import { BackgroundAssumptions } from "./BackgroundAssumptions";
import { MaintenanceExplainerDrawer } from "./MaintenanceExplainerDrawer";
import InputDropdown from "./InputDropdown";
import InputField from "./InputField";
import { Separator } from "@components/separator"

type CalculatorInputProps = {
  onSubmit: (data: FormFrontend) => void;
  isLoading?: boolean;
};
const CalculatorInput: React.FC<CalculatorInputProps> = ({ onSubmit, isLoading }) => {

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

  const form = useForm({
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

    return (
      <div className="flex flex-col justify-center w-full mx-auto md:h-[60rem]">
        <div className="h1-style text-lg md:text-xl lg:text-2xl">
          Calculate how much a Fairhold home might cost you
        </div>
        <div className="subheadstyle text-sm  md:text-base">
          Use this calculator to compare Fairhold with other ways of owning or renting. Try your current home, or a home you’d like to own.
        </div>
        <Separator className="my-4 bg-[rgb(var(--text-default-rgb))] h-[1px]" orientation="horizontal" />
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
                  <FormMessage className="--error-text-rgb" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="housePostcode"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="h3-style text-sm lg:text-base ">
                      Postcode
                    </FormLabel>
                    <FormControl>
                      <InputField
                        placeholder="e.g. SE17 1PE"
                        {...field}
                        error={!!fieldState.error}
                        className={`inputfield-style text-xs`}
                      />
                    </FormControl>
                    <FormMessage className="error-message-style" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseAge"
                render={({ field, fieldState }) => (
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
                      error={!!fieldState.error}
                      className="inputfield-style text-xs"
                    />
                    </FormControl>
                    <FormMessage className="error-message-style" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="houseBedrooms"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="h3-style text-sm lg:text-base ">
                      Number of bedrooms
                    </FormLabel>
                    <FormControl>
                      <InputField
                      placeholder="e.g. 2 for two bedrooms"
                      {...field}
                      value={field.value?.toString() || ''}
                      error={!!fieldState.error}
                      className="inputfield-style text-xs"
                      />
                    </FormControl>
                    <FormMessage className="error-message-style" />
                  </FormItem>
                )}
                
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormItem>
              <FormLabel className="h3-style text-sm lg:text-base text-[rgb(var(--text-inaccessible-rgb))]">
                Mortgage interest rate
              </FormLabel>
              <Input 
                value={`${DEFAULT_INTEREST_RATE * 100}%`}
                disabled
                className="inputfield-style text-xs bg-gray-100"
              />
            </FormItem>

            <FormItem>
              <FormLabel className="h3-style text-sm lg:text-base text-[rgb(var(--text-inaccessible-rgb))]">
                Mortgage term
              </FormLabel>
              <Input 
                value={`${DEFAULT_MORTGAGE_TERM} years`}
                disabled
                className="inputfield-style text-xs bg-gray-100"
              />
            </FormItem>

            <FormItem>
              <FormLabel className="h3-style text-sm lg:text-base text-[rgb(var(--text-inaccessible-rgb))]">
                Mortgage deposit
              </FormLabel>
              <Input 
                value={`${DEFAULT_INITIAL_DEPOSIT * 100}%`}
                disabled
                className="inputfield-style text-xs bg-gray-100"
              />
            </FormItem>
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
                      className="flex flex-col md:flex-row space-y-0 w-full gap-4 items-stretch" 
                      >

                      <div className="flex items-start space-x-2 bg-[rgb(var(--background-highlight))] py-4 px-4 flex-1 min-h-0">
                        <RadioGroupItem
                          value="none"
                          id="radio-option-none"
                          className="radio-button-style"
                        />
                        <div className="flex flex-col">
                        <Label
                          htmlFor="radio-option-none"
                          className="radio-label-style"
                        >
                          Nothing 
                        </Label>
                        <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-medium text-xs py-1">{MAINTENANCE_LEVELS.none * 100}%</span>
                        <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-normal text-xs">
                        I will not carry out any maintenance work.
                        </span>
                      </div>
                      </div>

                      <div className="flex items-start space-x-2 bg-[rgb(var(--background-highlight))] py-4 px-4 flex-1 min-h-0">
                        <RadioGroupItem
                          value="low"
                          id="radio-option-low"
                          className="radio-button-style"
                        />
                        <div className="flex flex-col">
                        <Label
                          htmlFor="radio-option-low"
                          className="radio-label-style"
                        >
                          Low 
                        </Label>
                        <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-medium text-xs py-1">{MAINTENANCE_LEVELS.low * 100}%</span>
                        <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-normal text-xs">
                          I will spend the minimum to keep my home habitable, carrying out essential repairs only.
                        </span>
                      </div>
                      </div>
                      <div className="flex items-start space-x-2 bg-[rgb(var(--background-highlight))] py-4 px-4 flex-1 min-h-0">
                        <RadioGroupItem
                          value="medium"
                          id="radio-option-medium"
                          className="radio-button-style"
                        />
                        <div className="flex flex-col">
                        <Label
                          htmlFor="radio-option-medium"
                          className="radio-label-style"
                        >
                          Medium 
                          </Label>
                          <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-medium text-xs py-1">{MAINTENANCE_LEVELS.medium * 100}%</span>
                          <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-normal text-xs">
                            I will maintain my home to a good standard, replacing elements like kitchens and bathrooms periodically.
                          </span>
                          </div>
                      </div>
                      <div className="flex items-start space-x-2 bg-[rgb(var(--background-highlight))] py-4 px-4 flex-1 min-h-0">
                        <RadioGroupItem
                          value="high"
                          id="radio-option-high"
                          className="radio-button-style"
                        />
                        <div className="flex flex-col">
                        <Label
                          htmlFor="radio-option-high"
                          className="radio-label-style"
                        >
                          High 
                          </Label>
                          <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-medium text-xs py-1">{MAINTENANCE_LEVELS.high * 100}%</span>
                          <span className="mt-1 text-[rgb(var(--text-inaccessible-rgb))] font-normal text-xs">
                          I will maintain my home to a good standard and invest in improvements such as energy retrofit or a new extension.
                            </span>
                            </div>
                        </div>
                    </RadioGroup>
                  </FormControl>
                  <MaintenanceExplainerDrawer />
                  <FormMessage  className="error-message-style" />
                  </FormItem>
              )}
            />
            <Button
              type="submit"
              className="calculate-button-style px-10 md:px-20"
              disabled={isLoading}
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

export default CalculatorInput;
