import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Calculation } from "@/app/schemas/calculationSchema";

interface InputFieldProps {
  id: keyof Calculation;
  placeholder: string;
  type: string;
  register: UseFormRegister<Calculation>;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  placeholder,
  register,
  type,
  error,
}) => {
  return (
    <>
      <input
        className="mb-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
       rounded-md "
        type={type}
        placeholder={placeholder}
        {...register(id)}
        id={id}
        key={id}
      />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};
export default InputField;
