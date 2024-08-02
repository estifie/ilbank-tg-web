import { Data } from "@/interfaces/data";
import { convertProgramTypeToString, convertUserTypesToString } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import Image from "next/image";
import NavigationBar from "./navigationBar";

const mockData: Data[] = [
	{
		code: 0,
		programName: "ADOBE READER",
		programType: 0,
		userTypes: [0, 1, 2],
	},
	{
		code: 1,
		programName: "YBS MOBİL UYGULAMASI",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 2,
		programName: "LEICAGSI",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 3,
		programName: "TOPCON - AKTARIM",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 4,
		programName: "CAMTASİA 2020",
		programType: 1,
		userTypes: [0, 1, 2],
	},
];

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1">
			<h1 className="text-xl md:text-2xl font-bold text-center select-none mb-4">Program Listesi</h1>
			<div className="w-full overflow-x-auto flex-1 flex justify-center items-center">
				<Table className="min-w-full max-w-screen-lg">
					<TableHeader>
						<TableRow>
							<TableHead className="select-none">Program Kodu</TableHead>
							<TableHead className="select-none">Program Adı</TableHead>
							<TableHead className="select-none">Program Türü</TableHead>
							<TableHead className="text-right select-none">Kurulacak Kişiler</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{mockData.map((data, index) => (
							<TableRow
								key={index}
								className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} px-4 py-2`}
							>
								<TableCell className="select-none">{data.code}</TableCell>
								<TableCell className="select-none">
									{data.programName.toLocaleUpperCase("tr-TR")}
								</TableCell>
								<TableCell className="select-none">
									{convertProgramTypeToString(data.programType)}
								</TableCell>
								<TableCell className="text-right select-none">
									{convertUserTypesToString(data.userTypes)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</main>
	);
}
