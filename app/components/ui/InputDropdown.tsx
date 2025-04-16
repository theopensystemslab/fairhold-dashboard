import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

const InputDropdown: React.FC<InputDropdownProps> = ({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}) => {
  return (
    <Select
      value={value?.toString() || ""}
      onValueChange={(val) => onValueChange(Number(val))}
    >
      <SelectTrigger
        className={`dropdown-style ${value !== undefined ? "selected" : ""} ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value.toString()}
            className="text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default InputDropdown;
