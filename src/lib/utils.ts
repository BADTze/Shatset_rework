import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const colorMaxDecider = (
  currentValue: number,
  stdMax: number | null,
  stdMin: number | null
) => {
  if (stdMin !== null && currentValue < stdMin) {
    return "text-red-600";
  }

  if (stdMax !== null && currentValue > stdMax) {
    return "text-red-600";
  }

  return "text-primary";
};

export const populateYears = (
  startYear = 2017,
  endYear = new Date().getFullYear()
) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

export const momentFormatterByMode = (mode: string) => {
  if (mode === "hourly") {
    return "HH";
  } else if (mode === "daily") {
    return "DD";
  } else if (mode === "monthly") {
    return "MM/YYYY";
  }
  return "HH";
};
