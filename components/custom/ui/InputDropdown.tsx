import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";

interface DropdownOption {
  readonly label: string;
  readonly value: number;
}

interface InputDropdownProps {
  value: number | undefined;
  onValueChange: (value: number) => void;
  options: readonly DropdownOption[];
  placeholder: string;
  className?: string;
  error?: boolean;
}

const InputDropdown: React.FC<InputDropdownProps> = ({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  error,
}) => {
  return (
    <div className={`relative ${error ? "pl-4" : ""}`}>
      {error && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
      )}
      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => onValueChange(Number(val))}
      >
        <SelectTrigger
          className={`dropdown-style ${value !== undefined ? "selected" : ""} ${className} ${error ? "border-red-500" : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              className="text-xs focus:bg-gray-200"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default InputDropdown;
