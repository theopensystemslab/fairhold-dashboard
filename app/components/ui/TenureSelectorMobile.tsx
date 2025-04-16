import React from 'react';

interface TenureSelectorMobileProps {
    selectedTenure: string;
    onChange: (tenure: string) => void;
    tenures: string[];
    tenureLabels: Record<string, string>;
    tenureColors: Record<string, string>; 
    tenureColorsLight: Record<string, string>;
    className?: string;
}

const TenureSelectorMobile: React.FC<TenureSelectorMobileProps> = ({
    selectedTenure,
    onChange,
    tenures,
    tenureLabels,
    tenureColors,
    tenureColorsLight,
    className,
}) => {
    return (
        <div className={`relative w-full ${className}`}>
        <select
          value={selectedTenure}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium transition-colors duration-200 ${className}`}
          style={{
            backgroundColor: tenureColorsLight[selectedTenure],
            color: tenureColors[selectedTenure],
            appearance: 'none',
        }}
        >
          {tenures.map((tenure) => (
            <option key={tenure} 
                value={tenure}
                style={{
                    backgroundColor: 'white',
                    color: 'rgb(var(--text-default-rgb))',
                  }}
                >
              {tenureLabels[tenure]}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke={tenureColors[selectedTenure]}
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
            </svg>
        </div>
        </div>
      );
};

export default TenureSelectorMobile;