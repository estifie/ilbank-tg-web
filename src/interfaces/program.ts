export interface Program {
	code: number;
	programName: string;
	programType: ProgramType;
	userTypes: UserType[];
}

export enum ProgramType {
	"Süreç Bazlı" = 0,
	"Birim Bazlı" = 1,
}

export enum UserType {
	"Personel" = 0,
	"Müdür" = 1,
	"Başkan" = 2,
}
