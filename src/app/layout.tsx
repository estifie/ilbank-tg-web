"use client";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@context/AuthContext";
import { DirectorateProvider } from "@context/DirectorateContext";
import { ProgramProvider } from "@context/ProgramContext";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<ProgramProvider>
				<DirectorateProvider>
					<html lang="en">
						<body className={inter.className}>{children}</body>
						<Toaster />
					</html>
				</DirectorateProvider>
			</ProgramProvider>
		</AuthProvider>
	);
}
