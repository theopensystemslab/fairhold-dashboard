import React from "react";
import { UseFormRegister } from "react-hook-form";

interface radioButtonProps {
  id: string;
  value: string;
  label: string;
  register: UseFormRegister<any>;
  error?: string;
}

const RadioButton: React.FC<radioButtonProps> = ({
  id,
  value,
  label,
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
          {...register("houseType")}
          value={value}
        />
        {label}
      </label>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default RadioButton;
