import Login from "@/app/admin/components/login";
import { useAuth } from "@context/AuthContext";
import React, { ComponentType, useEffect, useState } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
	const ComponentWithAuth: React.FC<P> = (props) => {
		const { jwtToken, loading } = useAuth();
		const [isClient, setIsClient] = useState<boolean>(false);

		useEffect(() => {
			setIsClient(true);
		}, []);

		if (!isClient) {
			return null;
		}

		if (!jwtToken && !loading) {
			return <Login />;
		}

		return <WrappedComponent {...(props as P)} />;
	};

	return ComponentWithAuth;
};

export default withAuth;
