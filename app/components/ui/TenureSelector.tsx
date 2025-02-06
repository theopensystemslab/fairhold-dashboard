import React from 'react';
import { cn } from "@/lib/utils";

interface TenureSelectorProps {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  tenureType: 'marketPurchase' | 'marketRent' | 'fairholdLandPurchase' | 'fairholdLandRent' | 'socialRent';
}

const TenureSelector: React.FC<TenureSelectorProps> = ({
  isSelected = false,
  onClick,
  className,
  children,
  tenureType
}) => {
  const getColors = () => {
    if (!isSelected) return "bg-[rgb(var(--button-background-rgb))] text-gray-700 hover:bg-gray-200";
    
    switch (tenureType) {
      case 'marketPurchase':
        return "bg-[rgb(var(--freehold-detail-color-rgb))] text-[rgb(var(--freehold-equity-color-rgb))]";
      case 'marketRent':
          return "bg-[rgb(var(--private-rent-detail-color-rgb))] text-[rgb(var(--private-rent-land-color-rgb))]";
      case 'fairholdLandPurchase':
        return "bg-[rgb(var(--fairhold-detail-color-rgb))] text-[rgb(var(--fairhold-equity-color-rgb))]";
      case 'fairholdLandRent':
          return "bg-[rgb(var(--fairhold-detail-color-rgb))] text-[rgb(var(--fairhold-equity-color-rgb))]";
      case 'socialRent':
        return "bg-[rgb(var(--social-rent-detail-color-rgb))] text-[rgb(var(--social-rent-land-color-rgb))]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl transition-colors duration-200",
        "text-sm font-medium",
        getColors(),
        className
      )}
    >
      {children}
    </button>
  );
};

export default TenureSelector;