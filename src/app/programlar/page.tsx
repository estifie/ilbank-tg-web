"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronRightIcon, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { convertUserTypesToString } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Data, ProgramType } from "@interfaces/data";
import Link from "next/link";

const data: Data[] = [
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
	{
		code: 5,
		programName: "CAMTASİA 2021",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 6,
		programName: "LEICAGSI",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 7,
		programName: "TOPCON - AKTARIM",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 8,
		programName: "CAMTASİA 2020",
		programType: 1,
		userTypes: [0, 1, 2],
	},
	{
		code: 9,
		programName: "CAMTASİA 2021",
		programType: 1,
		userTypes: [0, 1, 2],
	},
];

enum ColumnName {
	"code" = "Program Kodu",
	"programName" = "Program Adı",
	"programType" = "Program Türü",
	"userTypes" = "Kurulacak Kişiler",
}

export const columns: ColumnDef<Data>[] = [
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
		cell: ({ row }) => (
			<div className="capitalize text-left ml-4 underline underline-offset-4 font-medium">
				<Link href={`http://localhost:3000/public/${row.getValue("code")}.pdf`}>
					{row.getValue("programName")}
				</Link>
			</div>
		),
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
];

export default function ProgramListesi() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });

	// add one page is 5 rows
	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination,
		},
		onPaginationChange: setPagination,
	});

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1 justify-center">
			<div className="w-full mb-10">
				<h1 className="font-bold text-2xl">Program Listesi</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Tablo üzerinden programları inceleyebilir, dilediğiniz programın detaylarına
					<br />
					program adının üzerine tıklayarak ulaşabilirsiniz.
				</h1>
			</div>
			<div className="w-full">
				<div className="flex items-center justify-between py-4">
					<Input
						placeholder="Program adı ara..."
						value={(table.getColumn("programName")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("programName")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="ml-auto">
									Sütunlar <ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{ColumnName[column.id as keyof typeof ColumnName]}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										Program bulunamadı.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Önceki
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Sonraki
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
