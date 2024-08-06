import { Program } from "@interfaces/program";
import axios from "axios";
import React, { createContext, useContext, useState } from "react";

export interface ProgramContextType {
	programs: Program[];
	getPrograms: () => Promise<void>;
	addProgram: (program: Program) => Promise<void>;
	removeProgram: (id: string) => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [programs, setPrograms] = useState<Program[]>([]);
	const apiUrl = `/tg/api/programs`;

	const getPrograms = async () => {
		try {
			const response = await axios.get(apiUrl);
			setPrograms(response.data);
		} catch (error) {
			console.error("Programlar sunucudan alınamadı:", error);
		}
	};

	const addProgram = async (program: Program) => {
		try {
			await axios.post(apiUrl, program);
			getPrograms();
		} catch (error) {
			console.error("Program eklenemedi:", error);
		}
	};

	const removeProgram = async (id: string) => {
		try {
			await axios.delete(`${apiUrl}/${id}`, {});
			getPrograms();
		} catch (error) {
			console.error("Program silinemedi:", error);
		}
	};

	return (
		<ProgramContext.Provider value={{ programs, getPrograms, addProgram, removeProgram }}>
			{children}
		</ProgramContext.Provider>
	);
};

const usePrograms = () => {
	const context = useContext(ProgramContext);
	if (!context) {
		throw new Error("usePrograms must be used within a ProgramProvider");
	}
	return context;
};

export { ProgramProvider, usePrograms };
