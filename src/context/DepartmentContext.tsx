import api from "@config/axios";
import { Department } from "@interfaces/department";
import axios from "axios";
import { config } from "dotenv";
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
config();

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.0.195:8080/tg/api";

export interface DepartmentContextType {
	departments: Department[];
	departmentsLoading: boolean;
	getDepartments: () => Promise<Department[]>;
	addDepartment: (department: string) => Promise<void>;
	removeDepartment: (id: number) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [departments, setDepartments] = useState<Department[]>([]);
	const [departmentsLoading, setLoading] = useState<boolean>(false);
	const addDepartmentEndpoint = BASE_URL + `/admin/department`;
	const getDepartmentsEndpoint = BASE_URL + `/department`;

	const getDepartments = async () => {
		setLoading(true);
		try {
			console.log("Departmanlar alınıyor...");
			console.log(getDepartmentsEndpoint);
			const response = await axios.get(getDepartmentsEndpoint);
			console.log("Departmanlar alındı:", response.data);

			const names = response.data;
			setDepartments(names);

			return names;
		} catch (error) {
			toast.error("Departmanlar alınırken bir hata oluştu.", {
				duration: 5000,
			});
			console.error("Departmanlar sunucudan alınamadı:", error);
		} finally {
			setLoading(false);
		}
	};

	const addDepartment = async (name: string) => {
		setLoading(true);
		try {
			const data = {
				name: name.trim(),
			};
			await api.post(addDepartmentEndpoint, data);
			getDepartments();
		} catch (error) {
			toast.error("Departman eklenirken bir hata oluştu.");
			console.error("Departman eklenemedi:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeDepartment = async (id: number) => {
		setLoading(true);
		try {
			await api.delete(`${addDepartmentEndpoint}/${id}`, {});
			getDepartments();
		} catch (error) {
			toast.error("Departman silinirken bir hata oluştu.");
			console.error("Departman silinemedi:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DepartmentContext.Provider
			value={{
				departments,
				departmentsLoading,
				getDepartments,
				addDepartment,
				removeDepartment,
			}}
		>
			{children}
		</DepartmentContext.Provider>
	);
};

const useDepartments = () => {
	const context = useContext(DepartmentContext);
	if (!context) {
		throw new Error("useDepartments must be used within a DepartmentProvider");
	}
	return context;
};
export { DepartmentProvider, useDepartments };
