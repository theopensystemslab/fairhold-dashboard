import React from 'react';
import { cn } from "@lib/utils";

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
    if (!isSelected) {
      return {};
    }

    return {
      backgroundColor: tenureColorsLight[tenureType],
      color: tenureColorsDark[tenureType],
    };
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1 rounded-2xl transition-colors duration-200 bg-gray-200",
        "text-sm font-medium",
        className
      )}
      style={isSelected ? getColors() : undefined}
    >
      {children}
    </button>
  );
};

export default TenureSelector;