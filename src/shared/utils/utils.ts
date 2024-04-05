import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function nameLetters (name:string)  {
    return  name.split(" ").map(word => word.at(0)).slice(0, 2)
}