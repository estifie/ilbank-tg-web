import { convertUserTypesToString } from "@/lib/utils";
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
import { Data, ProgramType } from "@interfaces/program";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

export enum ColumnName {
	"code" = "Program Kodu",
	"programName" = "Program Adı",
	"programType" = "Program Türü",
	"userTypes" = "Kurulacak Kişiler",
}

export const columns: ColumnDef<Data>[] = [
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
		accessorKey: "programName",
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
		cell: ({ row }) => <div className="capitalize text-left ml-4">{row.getValue("programName")}</div>,
	},
	{
		accessorKey: "programType",
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
			const amount = parseFloat(row.getValue("programType"));

			return <div className="ml-4 font-medium">{ProgramType[amount]}</div>;
		},
	},
	{
		accessorKey: "userTypes",
		header: () => <div className="text-right">Kurulacak Kişiler</div>,
		cell: ({ row }) => {
			const userTypes = row.getValue("userTypes") as number[];

			return <div className="text-right">{convertUserTypesToString(userTypes)}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

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
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.code.toString())}>
							Programı Sil
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
