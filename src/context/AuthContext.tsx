import api from "@config/axios";
import { config } from "dotenv";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
config();

const BASE_URL = "http://localhost:8080/tg/api";

interface UserLoginType {
	username: string;
	password: string;
}

interface AuthContextType {
	jwtToken: string | null;
	login: (credentials: UserLoginType) => Promise<void>;
	logout: () => void;
	loading: boolean;
	addUser: (credentials: UserLoginType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [jwtToken, setJwtToken] = useState<string | null>(Cookies.get("jwtToken") || null);
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (jwtToken) {
			api.defaults.headers.Authorization = `Bearer ${jwtToken}`;
		} else {
			api.defaults.headers.Authorization = null;
		}
	}, [jwtToken]);

	const login = async (credentials: UserLoginType) => {
		setLoading(true);
		try {
			const response = await api.post(BASE_URL + "/login", credentials);
			const token = response.data.token;
			Cookies.set("jwtToken", token);
			setJwtToken(token || null);
		} catch (error) {
			toast.error("Giriş yapılırken bir hata oluştu.", {
				duration: 800,
			});
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const addUser = async (credentials: UserLoginType) => {
		try {
			const response = await api.post(BASE_URL + "/admin/register", credentials);
			const token = response.data.token;
			Cookies.set("jwtToken", token);
			setJwtToken(token || null);
			router.push("/admin");
		} catch (error) {
			toast.error("Kullanıcı eklenirken bir hata oluştu.", {
				duration: 5000,
			});
			console.error(error);
		}
	};

	const logout = () => {
		Cookies.remove("jwtToken");
		setJwtToken(null);
		api.defaults.headers.Authorization = null;
		toast.success("Başarıyla çıkış yapıldı.");
	};

	return (
		<AuthContext.Provider value={{ jwtToken, login, logout, loading, addUser }}>{children}</AuthContext.Provider>
	);
};

const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { AuthContext, AuthProvider, useAuth };
