export interface Program {
	code?: string;
	name: string;
	type: ProgramType;
	users: string[];
	directorateList?: string[];
	file?: File | null;
}

export type ProgramType = "Süreç" | "Birim";
