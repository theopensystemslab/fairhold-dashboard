import React, { useRef, useState } from "react";
import GraphCard from "./GraphCard";
import { Household } from "@/app/models/Household";
import { WhatWouldYouChoose } from "../Dashboard/Cards/WhatWouldYouChoose";
import { WhatDifference } from "../Dashboard/Cards/WhatDifference";
import { HowMuchFHCost } from "../Dashboard/Cards/HowMuchFHCost";
import { Carousel } from "./Carousel";
import { HowMuchPerMonth } from "../Dashboard/Cards/HowMuchPerMonth";
import { ResaleValue } from "../Dashboard/Cards/ResaleValue";

export interface DashboardProps {
  processedData: Household;
}

const Dashboard: React.FC<DashboardProps> = ({ processedData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const pageHeight = window.innerHeight;
      const newPage = Math.round(scrollTop / pageHeight);
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="snap-container">
      <div
        className="snap-scroll"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <HowMuchFHCost data={processedData} />
        <HowMuchPerMonth processedData={processedData} />
        <GraphCard title="How would the cost change over my life?"></GraphCard>
        <ResaleValue data={processedData} />
        <WhatDifference />
        <WhatWouldYouChoose />
      </div>
      <Carousel
        scrollContainerRef={scrollContainerRef}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Dashboard;
