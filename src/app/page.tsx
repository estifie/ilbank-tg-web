"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		router.push("/programlar");
	}, [router]);

	return (
		<div>
			<p>Yönlendiriliyorsunuz...</p>
		</div>
	);
};

export default Home;
