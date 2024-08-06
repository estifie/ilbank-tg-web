import Login from "@/app/admin/components/login";
import { useAuth } from "@context/AuthContext";
import React, { ComponentType } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
	const ComponentWithAuth: React.FC<P> = (props) => {
		const { jwtToken, loading } = useAuth();

		if (!jwtToken) {
			return <Login />;
		}

		return <WrappedComponent {...(props as P)} />;
	};

	return ComponentWithAuth;
};

export default withAuth;
