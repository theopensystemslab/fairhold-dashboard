import React, { useRef, useState } from "react";
import GraphCard from "./GraphCard";
import { Household } from "@/app/models/Household";
import { FormFrontend } from "@/app/schemas/formSchema";
import { WhatWouldYouChoose } from "../Dashboard/Cards/WhatWouldYouChoose";
import { WhatDifference } from "../Dashboard/Cards/WhatDifference";
import { HowMuchFHCost } from "../Dashboard/Cards/HowMuchFHCost";

interface DashboardProps {
  processedData: Household;
  inputData: FormFrontend;
}

const Dashboard: React.FC<DashboardProps> = ({ inputData, processedData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 5;

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: - window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentPage(currentPage - 1);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const pageHeight = window.innerHeight;
      const newPage = Math.round(scrollTop / pageHeight);
      setCurrentPage(newPage);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const someUnusedVariable = inputData;

  return (
    <div className="snap-container">
      <div
        className="snap-scroll"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {currentPage > 0 && (
          <div className="fixed top-4 right-4">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Previous
            </button>
          </div>
        )}
        <HowMuchFHCost data={processedData} />

        <GraphCard title="How much would it cost every month?">
          <span className="text-red-500">in theory less than Freehold</span>
        </GraphCard>
        <GraphCard title="How would the cost change over my life?"></GraphCard>
        <GraphCard title="How much could I sell it for?"></GraphCard>
        <WhatDifference />
        <WhatWouldYouChoose />
      </div>
      {currentPage < totalPages && (
        <div className="fixed bottom-4 right-4">
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
