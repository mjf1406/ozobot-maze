import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
      throw new Error("Minimum value cannot be greater than maximum value.");
  }
  
  // Ensure min and max are integers
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}