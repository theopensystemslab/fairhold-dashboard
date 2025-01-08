import React, { useRef } from "react";
import GraphCard from "./GraphCard";
import { Household } from "@/app/models/Household";

interface DashboardProps {
  data: Household;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // Dummy identity function to avoid linting errors
  const identity = (data: Household) => {
    return data;
  };
  identity(data);

  return (
    <div className="snap-container">
      <div className="snap-scroll" ref={scrollContainerRef}>
        <GraphCard title="How much would a Fairhold home cost?" />
        <GraphCard title="How much would it cost every month?" />
        <GraphCard title="How would the cost change over my life?" />
        <GraphCard title="How much could I sell it for?" />
        <GraphCard title="What difference would Fairhold make to me, my community, and the world?" />
        <GraphCard title="What would you choose?" />
      </div>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
