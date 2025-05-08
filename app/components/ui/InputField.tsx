import React from "react";
import { Input } from "@/components/ui/input";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  error?: boolean; 
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  error,
  className,
  ...rest
}) => {
  return (
    <div className={`relative ${error ? "pl-4" : ""}`}>
      {error && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
      <Input
        placeholder={placeholder}
        className={`${className || ""} ${error ? "border-red-500" : ""}`}
        {...rest}
      />
    </div>
  );
};
export default InputField;
