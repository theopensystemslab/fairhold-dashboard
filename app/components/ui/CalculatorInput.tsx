"use client";
import React, { useState } from "react";

const CalculatorInput = () => {
  const [housePostcode, sethousePostcode] = useState("");
  const [houseType, sethouseType] = useState("");
  const [houseBeds, setHouseBeds] = useState("");
  const [howSize, setHouseSize] = useState("");
  const [houseAge, setHouseAge] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    //fetch the data
    fetch("/api") // Replace 'your-api-route' with the actual path to your API route
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response data here
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors here
        console.error("Error:", error);
      });

    console.log(housePostcode);
  };

  return (
    <div className="flex items-center justify-center text-black mt-5">
      <div className=" w-1/2  border-black border-2 rounded-lg ">
        <div className="bg-black text-white h-48 flex items-center justify-center">
          <h1 className="text-6xl">Fairhold Calculator</h1>
        </div>
        <form onSubmit={handleSubmit} className=" flex flex-col m-5">
          <h2 className="mb-1 font-bold">House postcode</h2>
          <input
            className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
             rounded-md "
            type="text"
            placeholder="e.g. SE17 1PE"
            value={housePostcode}
            onChange={(e) => sethousePostcode(e.target.value)}
          />
          <h2 className="mb-1 font-bold">House size</h2>
          <input
            className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
             rounded-md "
            type="text"
            placeholder="Provide the house size in m square, e.g. 66"
            value={howSize}
            onChange={(e) => setHouseSize(e.target.value)}
          />

          <h2 className="mb-1 font-bold">House age</h2>
          <input
            className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
             rounded-md "
            type="float"
            placeholder="Provide the house age in years. For a new build, insert age 1"
            value={houseAge}
            onChange={(e) => setHouseAge(e.target.value)}
          />

          <h2 className="mb-1 font-bold">Number of bedrooms</h2>
          <input
            className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
             rounded-md "
            type="integer"
            placeholder="Provide the number of bedrooms e.g. 2"
            value={houseBeds}
            onChange={(e) => setHouseBeds(e.target.value)}
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
  );
};

export default CalculatorInput;
