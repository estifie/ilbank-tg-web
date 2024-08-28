import api from "@config/axios";
import { Program } from "@interfaces/program";
import axios, { AxiosResponse } from "axios";
import { config } from "dotenv";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";
config();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.0.195:8080/tg/api";

export interface ProgramContextType {
	programs: Program[];
	getPrograms: () => Promise<Program[]>;
	getProgramExtension: (code: string) => Promise<string>;
	addProgram: (program: Program) => Promise<void>;
	removeProgram: (id: string) => Promise<void>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

const ProgramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [programs, setPrograms] = useState<Program[]>([]);
	const addProgramEndpoint = BASE_URL + `/admin/file`;
	const getProgramsEndpoint = BASE_URL + `/files`;
	const addFileEndpoint = BASE_URL + `/admin/upload`;
	const router = useRouter();

	const getPrograms = async () => {
		try {
			const response = await axios.get(getProgramsEndpoint);
			setPrograms(response.data);

			return response.data;
		} catch (error) {}
	};

	const getProgramExtension = async (code: string) => {
		try {
			const response = await axios.get(`${getProgramsEndpoint}/extension/${code}`);
			return response.data;
		} catch (error) {}
	};

	const addProgram = async (program: Program) => {
		try {
			const data = {
				name: program.name.trim(),
				type: program.type,
				directorateList: program.directorateList,
				users: program.users,
				departments: program.departments,
			};
			await api
				.post(addProgramEndpoint, data)
				.then((response: AxiosResponse<any>) => {
					if (program.file) {
						const extension = program.file.name.split(".").pop();
						program.file = new File([program.file], response.data + "." + extension, {
							type: program.file.type,
						});

						addFile(program.file);
					}
				})
				.then(() => {
					router.back();
				});

			getPrograms();
		} catch (error) {
			console.error("Program eklenemedi:", error);
		}
	};

	const addFile = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await api.post(addFileEndpoint, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 202) {
			} else {
				console.error("Dosya yüklenemedi");
			}
		} catch (error) {
			console.error("Dosya yüklenirken hata oluştu:", error);
		}
	};

	const removeProgram = async (id: string) => {
		try {
			await api.delete(`${addProgramEndpoint}/${id}`);
			router.push("/admin/programlar");
			getPrograms();
		} catch (error) {
			console.error("Program silinemedi:", error);
		}
	};

	return (
		<ProgramContext.Provider value={{ programs, getPrograms, addProgram, removeProgram, getProgramExtension }}>
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
