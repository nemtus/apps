import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class TextValidation {
  static isSymbol(input: string) {
    return !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(input);
  }

  static isEmail(input: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  }
}
