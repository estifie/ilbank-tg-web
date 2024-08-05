import api from "@config/axios";
import { createContext, useContext, useEffect, useState } from "react";

interface UserLoginType {
	username: string;
	password: string;
}

interface AuthContextType {
	jwtToken: string | null;
	login: (credentials: UserLoginType) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem("jwtToken"));
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (jwtToken) {
			localStorage.setItem("jwtToken", jwtToken);
		} else {
			localStorage.removeItem("jwtToken");
		}
	}, [jwtToken]);

	const login = async (credentials: UserLoginType) => {
		setLoading(true);
		try {
			const response = await api.post("/tg/api/auth/login", credentials);
			setJwtToken(response.data.token);
			api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setJwtToken(null);
		api.defaults.headers.Authorization = null;
	};

	return (
		<AuthContext.Provider value={{ jwtToken, login, logout }}>
			{loading ? <div>Loading...</div> : children}
		</AuthContext.Provider>
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
