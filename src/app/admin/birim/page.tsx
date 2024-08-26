/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import anaMudurlukKategorileri from "@constants/anaMudurlukKategorileri";
import { useAuth } from "@context/AuthContext";
import { useDepartments } from "@context/DepartmentContext";
import { usePrograms } from "@context/ProgramContext";
import withAuth from "@hoc/withAuth";
import { Department } from "@interfaces/department";
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
import { ArrowLeft, Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { ColumnName, columns } from "./dataTableColumns";

function AdminDepartments() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });
	const [data, setData] = React.useState<Department[]>([]);
	const { getDepartments, departments, removeDepartment } = useDepartments();
	const router = useRouter();

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

	React.useEffect(() => {
		getDepartments();
	}, []);

	React.useEffect(() => {
		const departmentList: Department[] = [];

		for (let i = 0; i < departments.length; i++) {
			departmentList.push({
				name: departments[i],
			});
		}

		setData(departmentList);
	}, [departments]);

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1 justify-center">
			<div className="w-full mb-10">
				<ArrowLeft className="cursor-pointer mb-6 h-12 w-12" onClick={() => router.back()} />

				<h1 className="font-bold text-2xl">Birimleri Düzenle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Tablo üzerinden birimleri inceleyebilir, dilediğiniz müdürlüğü düzenleyebilirsiniz. Sağ üst köşede
					bulunan
					<br />
					menüden sütunları gösterebilir veya gizleyebilirsiniz.
				</h1>
			</div>

			<div className="w-full">
				<div className="flex items-center justify-between py-4">
					<div className="flex flex-row">
						<Input
							placeholder="Birim ara..."
							value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
							onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
							className="max-w-sm mr-6"
						/>
						<Button>
							<Link href={"/admin/birim-ekle"}>Birim Ekle</Link>
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
										Birim bulunamadı.
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
										onClick={() => {}}
									>
										Seçilenleri Sil
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Emin misin?</AlertDialogTitle>
										<AlertDialogDescription>
											Bu işlem geri alınamaz. Seçilen birimlerin bütün detaylarını ve verilerini
											kalıcı olarak silmek istediğinize emin misiniz?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>İptal</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												table.getFilteredSelectedRowModel().rows.forEach((row) => {
													removeDepartment(row.original.name).then(() => {
														getDepartments();
														toast.success("Birim başarıyla silindi.");
													});
												});
											}}
										>
											Evet, Eminim
										</AlertDialogAction>
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

export default withAuth(AdminDepartments);
