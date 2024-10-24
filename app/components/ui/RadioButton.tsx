import React from "react";
import { UseFormRegister, Path } from "react-hook-form";
import { Calculation } from "@/app/schemas/calculationSchema";

interface radioButtonProps {
  id: string;
  value: string;
  label: string;
  name: Path<Calculation>;
  register: UseFormRegister<Calculation>;
  error?: string;
}

const RadioButton: React.FC<radioButtonProps> = ({
  id,
  value,
  label,
  name,
  register,
  error,
}) => {
  return (
    <>
      <label className="mx-2">
        <input
          className="accent-black"
          type="radio"
          id={id}
          {...register(name)}
          value={value}
        />
        {label}
      </label>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default RadioButton;
