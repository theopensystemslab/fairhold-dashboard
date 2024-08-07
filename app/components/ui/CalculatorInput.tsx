"use client";

import React, { useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import calculateFairhold from "@/app/models/testClasses";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";
import {
  calculationSchema,
  Calculation,
} from "@/app/schemas/calculationSchema";

import RadioButton from "./RadioButton";
import InputField from "./InputField";

const houseTypes = {
  Detached: "D",
  Semidetached: "S",
  Terrace: "T",
  Flat: "F",
}; // variables associated to the house types

const CalculatorInput = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Calculation>({
    resolver: zodResolver(calculationSchema),
  });

  // create different view states: one for form and one for graph dashboard
  const [view, setView] = useState("form");
  const [data, setData] = useState<Household | null>(null);

  const onSubmit = async (data: Calculation) => {
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // pass the form data to the API
    });

    const jsonData = await response.json();
    const processedData = calculateFairhold(jsonData);

    // saved processedData & switch to dashboard view
    setData(processedData);
    setView("dashboard");
  };

  return view === "form" ? (
    <div className="flex -centeitemsr justify-center text-black mt-5">
      <div className=" w-1/2  border-black border-2 rounded-lg ">
        <div className="bg-black text-white h-48 flex items-center justify-center">
          <h1 className="text-6xl">Fairhold Calculator</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col m-5">
          <h2 className="mb-1 font-bold">House postcode</h2>
          <InputField
            id="housePostcode"
            type="text"
            placeholder="set the postcode, e.g. SE17 1PE"
            register={register}
            error={errors.housePostcode?.message}
          />

          <h2 className="mb-1 font-bold">House size</h2>
          <InputField
            type="number"
            placeholder="Provide the house size in m square, e.g. 66"
            id="houseSize"
            register={register}
            error={errors.houseSize?.message}
          />

          <h2 className="mb-1 font-bold">House type</h2>
          <div className="flex">
            {Object.entries(houseTypes).map(([label, value]) => (
              <RadioButton
                key={label}
                label={label}
                id={label}
                value={value}
                register={register}
                error={errors.houseType?.message}
              />
            ))}
          </div>

          <h2 className="mb-1 font-bold">House age</h2>
          <InputField
            type="number"
            placeholder="Provide the house age in years. For a new build, insert age 1"
            id="houseAge"
            register={register}
            error={errors.houseAge?.message}
          />
          <h2 className="mb-1 font-bold">Number of bedrooms</h2>
          <InputField
            type="number"
            placeholder="Provide the number of bedrooms e.g. 2"
            id="houseBedrooms"
            register={register}
            error={errors.houseBedrooms?.message}
          />
          <button
            className="text-white bg-black w-1/3 rounded-xl"
            type="submit"
          >
            Calculate
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Dashboard data={data as Household} />
  );
};

export default CalculatorInput;
