import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  interface DropdownOption {
    readonly label: string;
    readonly value: number;
}

interface InputDropdownProps {
    value: number | undefined;
    onValueChange: (value: number) => void;
    options: readonly DropdownOption[];
    placeholder: string;
}

const InputDropdown: React.FC<InputDropdownProps> = ({
    value,
    onValueChange,
    options,
    placeholder
}) => {
    return (
        <Select 
            value={value?.toString() || ""} 
            onValueChange={(val) => onValueChange(Number(val))}
        >
            <SelectTrigger className="inputfield-style ">
                <SelectValue placeholder={placeholder} className=".inputfield-style:focus::placeholder"/>
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
    )
};

export default InputDropdown;