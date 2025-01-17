import React from 'react';
import { cn } from "@/lib/utils";

interface TenureSelectorProps {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const TenureSelector: React.FC<TenureSelectorProps> = ({
  isSelected = false,
  onClick,
  className,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg transition-colors duration-200",
        "text-sm font-medium",
        isSelected
          ? "bg-green-100 text-green-700" // Selected state
          : "bg-gray-100 text-gray-700 hover:bg-gray-200", // Default state
        className
      )}
    >
      {children}
    </button>
  );
};

export default TenureSelector;