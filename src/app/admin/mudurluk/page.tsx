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
import { useDirectorates } from "@context/DirectorateContext";
import { usePrograms } from "@context/ProgramContext";
import withAuth from "@hoc/withAuth";
import { Directorate } from "@interfaces/directorate";
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
import { ArrowLeft, Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { ColumnName, columns } from "./dataTableColumns";

function AdminDirectorates() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
	const [data, setData] = React.useState<Directorate[]>([]);
	const { getDirectorates, directorates, removeDirectorate } = useDirectorates();
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
		getDirectorates();
	}, []);

	React.useEffect(() => {
		const directorateList: Directorate[] = [];

		for (let i = 0; i < directorates.length; i++) {
			const name = directorates[i].name!;

			directorateList.push({
				id: directorates[i].id,
				realName: name,
				name: name.replace("gm-", "").replace("bm-", ""),
				mainDirectorate: name.startsWith("gm-")
					? "Genel Müdürlük"
					: name.startsWith("bm-")
					? "Bölge Müdürlüğü"
					: "Yok",
			});
		}

		setData(directorateList);
	}, [directorates]);

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-12   md:pt-12 flex-1 justify-center">
			<div className=" w-full flex flex-col justify-center items-center">
				<Image
					src="/wide-logo.png"
					alt="Logo"
					width={369 / 1.2}
					height={83 / 1.2}
					className="mb-8"
					style={{
						userSelect: "none",
						pointerEvents: "none",
					}}
					draggable={false}
				/>
				<h2 className="text-md font-bold select-none pointer-events-none -mt-5 mb-5">
					BİLİŞİM AĞLARI VE ALTYAPI SİSTEMLERİ MÜDÜRLÜĞÜ
				</h2>
				<h2 className="text-xl font-bold select-none pointer-events-none -mt-5 mb-5">
					BİRİM VE SÜREÇ BAZLI PROGRAMLAR
				</h2>
			</div>
			<div className="w-full mb-10">
				<ArrowLeft className="cursor-pointer mb-6 h-12 w-12" onClick={() => router.back()} />

				<h1 className="font-bold text-2xl">Müdürlükleri Düzenle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Tablo üzerinden müdürlükleri inceleyebilir, dilediğiniz müdürlüğü düzenleyebilirsiniz. Sağ üst
					köşede bulunan
					<br />
					menüden sütunları gösterebilir veya gizleyebilirsiniz.
				</h1>
			</div>

			<div className="w-full">
				<div className="flex items-center justify-between py-4">
					<div className="flex flex-row">
						<Input
							placeholder="Müdürlük ara..."
							value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
							onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
							className="max-w-sm mr-6"
						/>
						<Button>
							<Link href={"/admin/mudurluk-ekle"}>Müdürlük Ekle</Link>
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
										Müdürlük bulunamadı.
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
											Bu işlem geri alınamaz. Seçilen müdürlüklerin bütün detaylarını ve
											verilerini kalıcı olarak silmek istediğinize emin misiniz?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>İptal</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												table.getFilteredSelectedRowModel().rows.forEach((row) => {
													removeDirectorate(row.original.id!).then(() => {
														getDirectorates();
														toast.success("Müdürlük başarıyla silindi.");
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

export default withAuth(AdminDirectorates);
