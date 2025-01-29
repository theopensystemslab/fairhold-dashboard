import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

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
            onValueChange={(value: string) => onValueChange(Number(value))}
            >
                <FormControl>
                <SelectTrigger className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 inputfield-style">
                <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} 
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
