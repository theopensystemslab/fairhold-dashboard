import React from "react";
import GraphCard1 from "./GraphCard1";
import GraphCard2 from "./GraphCard2";
import GraphCard3 from "./GraphCard3";
import GraphCard4 from "./GraphCard4";
import GraphCard5 from "./GraphCard5";
import GraphCard6 from "./GraphCard6";
import { Household } from "@/app/models/Household";

interface DashboardProps {
  data: Household;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const handleNext = () => {
    const container = document.querySelector(".snap-scroll") as HTMLElement;
    if (container) {
      container.scrollBy({
        top: window.innerHeight, // Scroll by one viewport height
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  return (
    <div className="snap-container">
      <div className="snap-scroll">
        <GraphCard1 household={data} />
        <GraphCard2 household={data} />
        <GraphCard3 household={data} />
        <GraphCard4 household={data} />
        <GraphCard5 household={data} />
        <GraphCard6 household={data} />
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
