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
import { Directorate } from "@interfaces/directorate";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export enum ColumnName {
	"name" = "Müdürlük Adı",
	"mainDirectorate" = "Ana Müdürlük",
}

const ActionsCell = ({ row }: { row: any }) => {
	const { removeDirectorate, getDirectorates } = useDirectorates();
	const router = useRouter();

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
						removeDirectorate(row.original.realName).then(() => {
							getDirectorates();
						});
					}}
				>
					Müdürlüğü Sil
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const columns: ColumnDef<Directorate>[] = [
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
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Müdürlük Adı
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div className="capitalize ml-4">{row.getValue("name")}</div>,
	},
	{
		accessorKey: "mainDirectorate",
		header: ({ column }) => {
			return (
				<div className="">
					<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Ana Müdürlük
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="ml-4 font-medium">
					{row.getValue("mainDirectorate") ? row.getValue("mainDirectorate") : "Yok"}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ActionsCell,
	},
];
