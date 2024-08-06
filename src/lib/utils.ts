import { UserType } from "@interfaces/program";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertUserTypesToString(userTypes: UserType[]) {
	return userTypes.map((userType) => UserType[userType]).join(", ");
}

export function convertProgramTypeToString(programType: number) {
	return programType === 0 ? "Süreç Bazlı" : "Birim Bazlı";
}
