"use client";

import React, { useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import calculateFairhold from "@/app/models/testClasses";
import { Household } from "@/app/models/Household";
import Dashboard from "./Dashboard";

const CalculatorInput = () => {
  const { register, handleSubmit } = useForm();
  // create different view states: one for form and one for graph dashboard
  const [view, setView] = useState("form");
  const [data, setData] = useState<Household | null>(null);
  const houseTypes = {
    Detached: "D",
    Semidetached: "S",
    Terrace: "T",
    Flat: "F",
  }; // variables associated to the house types

  // Define the props type
  interface radioButtonProps {
    id: string;
    value: string;
    label: string;
    register: UseFormRegister<any>;
  }

  const RadioButtonsHousetype: React.FC<radioButtonProps> = ({
    id,
    value,
    label,
    register,
  }) => {
    return (
      <label className="mx-2">
        <input
          className="accent-black"
          type="radio"
          id={id}
          {...register("houseType")}
          value={value}
        />
        {label}
      </label>
    );
  };

  interface inputEntryProps {
    id: string;
    placeholder: string;
    register: UseFormRegister<any>;
    type: string;
  }
  const InputEntryField: React.FC<inputEntryProps> = ({
    id,
    placeholder,
    register,
    type,
  }) => {
    return (
      <input
        className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
       rounded-md "
        type={type}
        placeholder={placeholder}
        {...register(id)}
        id={id}
        key={id}
      />
    );
  };

  const submitFormData = () => {};

  return view === "form" ? (
    <div className="flex -centeitemsr justify-center text-black mt-5">
      <div className=" w-1/2  border-black border-2 rounded-lg ">
        <div className="bg-black text-white h-48 flex items-center justify-center">
          <h1 className="text-6xl">Fairhold Calculator</h1>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            console.log(JSON.stringify(data));
            const response = await fetch("/api", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data), // pass the form data to the API
            });

            const jsonData = await response.json();
            console.log("handleSubmit jsonData: ", jsonData);
            const processedData = calculateFairhold(jsonData);
            console.log("handleSubmit processedData: ", processedData);

            // saved processedData & switch to dashboard view
            setData(processedData);
            setView("dashboard");
          })}
          className=" flex flex-col m-5"
        >
          <h2 className="mb-1 font-bold">House postcode</h2>
          <InputEntryField
            id="housePostcode"
            type="text"
            placeholder="set the postcode, e.g. SE17 1PE"
            register={register}
          />

          <h2 className="mb-1 font-bold">House size</h2>
          <InputEntryField
            type="number"
            placeholder="Provide the house size in m square, e.g. 66"
            id="houseSize"
            register={register}
          />

          <h2 className="mb-1 font-bold">House typology</h2>
          <div className="flex">
            {Object.entries(houseTypes).map(([label, value]) => (
              <RadioButtonsHousetype
                key={label}
                label={label}
                id={label}
                value={value}
                register={register}
              />
            ))}
          </div>

          <h2 className="mb-1 font-bold">House age</h2>
          <InputEntryField
            type="number"
            placeholder="Provide the house age in years. For a new build, insert age 1"
            id="houseAge"
            register={register}
          />
          <h2 className="mb-1 font-bold">Number of bedrooms</h2>
          <InputEntryField
            type="number"
            placeholder="Provide the number of bedrooms e.g. 2"
            id="houseBedrooms"
            register={register}
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
