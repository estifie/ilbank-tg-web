import api from "@config/axios";
import axios from "axios";
import { config } from "dotenv";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
config();

const BASE_URL = "http://localhost:8080/tg/api/";

export interface DirectorateContextType {
	directorates: string[];
	directoratesLoading: boolean;
	getDirectorates: () => Promise<string[]>;
	addDirectorate: (directorate: string) => Promise<void>;
	removeDirectorate: (name: string) => Promise<void>;
}

const DirectorateContext = createContext<DirectorateContextType | undefined>(undefined);

const DirectorateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [directorates, setDirectorates] = useState<string[]>([]);
	const [directoratesLoading, setLoading] = useState<boolean>(false);
	const addDirectorateEndpoint = BASE_URL + `admin/directorate`;
	const getDirectoratesEndpoint = BASE_URL + `directorate`;

	const getDirectorates = async () => {
		setLoading(true);
		try {
			console.log("Müdürlükler alınıyor...");
			console.log(getDirectoratesEndpoint);
			const response = await axios.get(getDirectoratesEndpoint);
			console.log("Müdürlükler alındı:", response.data);

			/*
				API RESPONSE FORMAT
			  	{
					"id": 1,
					"name": "Test",
					"fileList": []
				}
			*/

			const names = response.data.map((item: any) => item.name);
			setDirectorates(names);

			return names;
		} catch (error) {
			toast.error("Müdürlükler alınırken bir hata oluştu.", {
				duration: 5000,
			});
			console.error("Müdürlükler sunucudan alınamadı:", error);
		} finally {
			setLoading(false);
		}
	};

	const addDirectorate = async (name: string) => {
		setLoading(true);
		try {
			const data = {
				name: name,
			};
			await api.post(addDirectorateEndpoint, data);
			getDirectorates();
		} catch (error) {
			toast.error("Müdürlük eklenirken bir hata oluştu.");
			console.error("Müdürlük eklenemedi:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeDirectorate = async (id: string) => {
		setLoading(true);
		try {
			await api.delete(`${addDirectorateEndpoint}/${id}`, {});
			getDirectorates();
		} catch (error) {
			toast.error("Müdürlük silinirken bir hata oluştu.");
			console.error("Müdürlük silinemedi:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DirectorateContext.Provider
			value={{
				directorates,
				directoratesLoading,
				getDirectorates,
				addDirectorate,
				removeDirectorate,
			}}
		>
			{children}
		</DirectorateContext.Provider>
	);
};

const useDirectorates = () => {
	const context = useContext(DirectorateContext);
	if (!context) {
		throw new Error("useDirectorates must be used within a DirectorateProvider");
	}
	return context;
};

export { DirectorateProvider, useDirectorates };
