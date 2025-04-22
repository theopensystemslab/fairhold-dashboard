import React from 'react';
import { cn } from "@/lib/utils";

interface TenureSelectorProps {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  tenureColorsDark: Record<string, string>; 
  tenureColorsLight: Record<string, string>;
  tenureType: 'marketPurchase' | 'marketRent' | 'fairholdLandPurchase' | 'fairholdLandRent' | 'socialRent';
}

const TenureSelector: React.FC<TenureSelectorProps> = ({
  isSelected = false,
  onClick,
  className,
  children,
  tenureColorsDark,
  tenureColorsLight,
  tenureType
}) => {
  const getColors = () => {
    if (!isSelected) return "bg-[rgb(var(--button-background-rgb))] text-gray-700 hover:bg-gray-200";
    
    return `bg-[${tenureColorsLight[tenureType]}] text-[${tenureColorsDark[tenureType]}] hover:bg-[${tenureColorsLight[tenureType]}]`;
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