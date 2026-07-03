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
    // 区切りドットを文字クラスから除外して曖昧さ (overlap) を排除し、線形時間で判定する。
    // これにより polynomial ReDoS を回避する。副次的に連続/先頭/末尾ドットは無効になる。
    return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(input);
  }
}
