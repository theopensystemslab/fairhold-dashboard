"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";
import { formSchema, formType } from "@/app/schemas/formSchema";

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

const maintenance = {
  "Low (1.5%)": "0.015",
  "Medium (2.0%)": "0.02",
  "High (3.75%)": "0.0375",
}; // variables associated with maintenance spend levels

const CalculatorInput = () => {
  const methods = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseType: "D", // Default value for house type
      maintenanceSpend: "0.02",
    },
  });

  const [view, setView] = useState("form");
  const [data, setData] = useState<Household | null>(null);

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
                        <RadioGroupItem value="D" id="option-one" />
                        <Label htmlFor="option-one">Detached</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="S" id="option-two" />
                        <Label htmlFor="option-two">Semi detached</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="T" id="option-three" />
                        <Label htmlFor="option-tree">Terrace</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="option-four" />
                        <Label htmlFor="option-four">Flat</Label>
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
