"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { useAuth } from "@context/AuthContext";
import withAuth from "@hoc/withAuth";
import { Program } from "@interfaces/program";
import {
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
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { ColumnName, columns } from "./dataTableColumns";

const data: Program[] = [
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

function AdminPrograms() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });

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
				<h1 className="font-bold text-2xl">Programları Düzenle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Tablo üzerinden programları inceleyebilir, dilediğiniz programı düzenleyebilirsiniz. Sağ üst köşede
					bulunan
					<br />
					menüden sütunları gösterebilir veya gizleyebilirsiniz.
				</h1>
			</div>
			<div className="w-full">
				<div className="flex items-center justify-between py-4">
					<div className="flex flex-row">
						<Input
							placeholder="Program adı ara..."
							value={(table.getColumn("programName")?.getFilterValue() as string) ?? ""}
							onChange={(event) => table.getColumn("programName")?.setFilterValue(event.target.value)}
							className="max-w-sm mr-6"
						/>
						<Button>
							<Link href={"/program-ekle"}>Program Ekle</Link>
						</Button>
					</div>

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
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredRowModel().rows.length} programdan{" "}
						{table.getFilteredSelectedRowModel().rows.length} tanesi seçildi.
						<div className="mt-8">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										disabled={table.getFilteredSelectedRowModel().rows.length === 0}
									>
										Seçilenleri Sil
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Emin misin?</AlertDialogTitle>
										<AlertDialogDescription>
											Bu işlem geri alınamaz. Seçilen programların bütün detaylarını ve verilerini
											kalıcı olarak silmek istediğinize emin misiniz?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>İptal</AlertDialogCancel>
										<AlertDialogAction>Evet, Eminim</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
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

export default withAuth(AdminPrograms);