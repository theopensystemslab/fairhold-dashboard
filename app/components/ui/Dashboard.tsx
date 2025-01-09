import React, { useRef, useState } from "react";
import GraphCard from "./GraphCard";
import { Household } from "@/app/models/Household";
import { FormFrontend } from "@/app/schemas/formSchema";
import { WhatWouldYouChoose } from "../Dashboard/Cards/WhatWouldYouChoose";

interface DashboardProps {
  processedData: Household;
  inputData: FormFrontend;
}

const Dashboard: React.FC<DashboardProps> = ({ inputData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 6;

  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
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
        <GraphCard title="How much would a Fairhold home cost?">
          <span className="text-red-500">Not much</span>
        </GraphCard>

        <GraphCard title="How much would it cost every month?">
          <span className="text-red-500">in theory less than Freehold</span>
        </GraphCard>
        <GraphCard title="How would the cost change over my life?"></GraphCard>
        <GraphCard title="How much could I sell it for?"></GraphCard>
        <GraphCard title="What difference would Fairhold make to me, my community, and the world?"></GraphCard>
        <WhatWouldYouChoose/>
      </div>
      {currentPage < totalPages - 1 && (
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
