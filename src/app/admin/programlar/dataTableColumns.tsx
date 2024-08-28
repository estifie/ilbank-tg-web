import { displayArray } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useDirectorates } from "@context/DirectorateContext";
import { usePrograms } from "@context/ProgramContext";
import { Program } from "@interfaces/program";
import { ColumnDef } from "@tanstack/react-table";
import { config } from "dotenv";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
config();

const PDF_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.16.0.195:8080";

export enum ColumnName {
	"code" = "Program Kodu",
	"name" = "Program Adı",
	"type" = "Program Türü",
	"users" = "Kurulacak Kişiler",
	"departments" = "Süreç Sahipleri",
}

const ActionsCell = ({ row }: { row: any }) => {
	const { removeProgram, getPrograms, getProgramExtension } = usePrograms();
	const { getDirectorates } = useDirectorates();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only"></span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>İşlemler</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						console.log(row.original.code);
						removeProgram(row.original.code!).then(() => {
							getDirectorates().then(() => {
								getPrograms();
							});
							toast.success("Program başarıyla silindi.");
						});
					}}
				>
					Programı Sil
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const GetProgramCell = ({ row }: { row: any }) => {
	const { getProgramExtension } = usePrograms();

	const [extension, setExtension] = React.useState<string>("");

	React.useEffect(() => {
		getProgramExtension(row.original.code).then((data) => {
			console.log(data);
			setExtension(data);
		});
	}, []);

	return (
		<div className="capitalize text-left ml-4 underline underline-offset-4 font-medium">
			<Link href={`${PDF_BASE_URL}/${row.original.code}.${extension}`}>{row.original.name}</Link>
		</div>
	);
};

export const columns: ColumnDef<Program>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Hepsini seç"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Bu satırı seç"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "code",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Program Kodu
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="capitalize ml-4">{row.getValue("code")}</div>,
	},
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<div className="">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Program Adı
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			return <GetProgramCell row={row} />;
		},
	},
	{
		accessorKey: "type",
		header: ({ column }) => {
			return (
				<div className="">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Program Türü
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const baz = row.getValue("type") + " Bazlı";

			return <div className="ml-4 font-medium">{baz}</div>;
		},
	},
	{
		accessorKey: "departments",
		header: () => <div className="text-right">Süreç Sahipleri</div>,
		cell: ({ row }) => {
			const birimler = row.getValue("departments") as string[];

			return <div className="text-right">{displayArray(birimler)}</div>;
		},
	},
	{
		accessorKey: "users",
		header: () => <div className="text-right">Kurulacak Kişiler</div>,
		cell: ({ row }) => {
			const users = row.getValue("users") as string[];

			return <div className="text-right">{displayArray(users)}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ActionsCell,
	},
];
