import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Minus, Plus } from "lucide-react";

interface NumberInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: NumberInputProps) {
  const handleSubtract = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newValue = value - step;
    if (min !== undefined && newValue < min) {
      return;
    }
    triggerChange(newValue);
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newValue = value + step;
    if (max !== undefined && newValue > max) {
      return;
    }
    triggerChange(newValue);
  };

  const triggerChange = (newValue: number) => {
    const syntheticEvent = {
      target: { value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className={`flex ${className}`}>
      <Button
        size="icon"
        variant="outline"
        className="rounded-l-md rounded-r-none bg-accent"
        onClick={handleSubtract}
      >
        <Minus />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="hide-spinner w-16 rounded-none text-center"
      />
      <Button
        size="icon"
        variant="outline"
        className="rounded-l-none rounded-r-md bg-accent"
        onClick={handleAdd}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default NumberInput;
