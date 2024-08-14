import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function displayUserTypes(users: string[]) {
	return users.join(", ") || "Kullanıcı Yok";
}

export function convertProgramTypeToString(type: number) {
	return type === 0 ? "Süreç Bazlı" : "Birim Bazlı";
}
