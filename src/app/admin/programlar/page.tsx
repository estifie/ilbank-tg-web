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

function AdminPrograms() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
	const [data, setData] = React.useState<Program[]>([]);
	const { getDirectorates, directorates, directoratesLoading } = useDirectorates();
	const { getPrograms, removeProgram, programs, getProgramExtension } = usePrograms();
	const [selectedButton, setSelectedButton] = React.useState<number>(-3);
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
		getDirectorates().then((directorates) => {
			getPrograms().then((programs) => {
				console.log("Programlar alındı:", programs);
			});
		});
	}, []);

	React.useEffect(() => {
		// If selectedButton is -3, then show all programs
		if (selectedButton === -3) {
			setData(programs);
		} else {
			console.log("selectedButton", selectedButton);
			console.log(directorates[selectedButton]);
			setData(
				programs.filter((program) => program.directorateList?.includes(directorates[selectedButton].name!)),
			);
		}
	}, [programs, directorates]);

	return (
		<main className="min-h-screen flex flex-col p-4 md:p-12 md:pt-12 flex-1">
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
			<div className="mt-6 mb-6 w-full">
				<Button
					key={"hepsi"}
					variant={selectedButton === -3 ? "default" : "outline"}
					className="mr-2 mb-2"
					onClick={() => {
						setSelectedButton(-3);
						setData(programs);
					}}
				>
					Tüm Programlar
				</Button>
				{directorates
					.filter((mudurluk) => !mudurluk.name!.includes("-"))
					.map((mudurluk) => (
						<Button
							key={mudurluk.name!}
							variant={selectedButton === directorates.indexOf(mudurluk) ? "default" : "outline"}
							className="mr-2 mb-2"
							onClick={() => {
								setSelectedButton(directorates.indexOf(mudurluk));

								setData(
									programs.filter((program) => program.directorateList?.includes(mudurluk.name!)),
								);
							}}
						>
							{mudurluk.name!}
						</Button>
					))}
				<Combobox
					label={"Genel Müdürlükler"}
					id={"gm"}
					setData={setData}
					setSelectedButton={setSelectedButton}
					programs={programs}
					buttonId={-1}
					selectedButton={selectedButton}
				/>
				<Combobox
					label={"Bölge Müdürlükleri"}
					id={"bm"}
					setData={setData}
					setSelectedButton={setSelectedButton}
					programs={programs}
					buttonId={-2}
					selectedButton={selectedButton}
				/>
			</div>
			<div className="w-full">
				<div className="flex items-center justify-between py-4">
					<div className="flex flex-row">
						<Input
							placeholder="Program adı ara..."
							value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
							onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
							className="max-w-sm mr-6"
						/>
						<Button>
							<Link href={"/admin/program-ekle"}>Program Ekle</Link>
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
										onClick={() => {}}
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
										<AlertDialogAction
											onClick={() => {
												table.getFilteredSelectedRowModel().rows.forEach((row) => {
													removeProgram(row.original.code!).then(() => {
														getDirectorates().then(() => {
															getPrograms();
														});
														toast.success("Program başarıyla silindi.");
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

export default withAuth(AdminPrograms);

const Combobox = ({
	label,
	id,
	setData,
	setSelectedButton,
	programs,
	buttonId,
	selectedButton,
}: {
	label: string;
	id: string;
	buttonId: number;
	setData: React.Dispatch<React.SetStateAction<Program[]>>;
	setSelectedButton: React.Dispatch<React.SetStateAction<number>>;
	programs: Program[];
	selectedButton: number;
}) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const { getDirectorates, directorates } = useDirectorates();
	const [directorateList, setDirectorateList] = React.useState<string[]>([]);

	React.useEffect(() => {
		getDirectorates();
	}, []);

	// When selectedButton changes if it is not equal to buttonId, then set value ""
	React.useEffect(() => {
		if (selectedButton !== buttonId) {
			setValue("");
		}
	}, [selectedButton]);

	React.useEffect(() => {
		// replace id- with ""
		setDirectorateList(
			directorates
				.filter((mudurluk) => mudurluk.name!.startsWith(id + "-"))
				.map((mudurluk) => mudurluk.name!.replace(id + "-", "")),
		);
	}, [directorates]);

	React.useEffect(() => {
		if (value) {
			setData(programs.filter((program) => program.directorateList?.includes(id + "-" + value)));
			setSelectedButton(buttonId);
		}
	}, [value]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between mr-2 mb-2"
				>
					{value ? directorateList.find((mudurluk) => mudurluk === value) : label}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Bir müdürlük ara..." />
					<CommandList>
						<CommandEmpty>Bir müdürlük bulunamadı.</CommandEmpty>
						<CommandGroup>
							{directorateList.map((directorate) => (
								<CommandItem
									key={directorate}
									value={directorate}
									onSelect={(currentValue) => {
										if (currentValue === value) {
											setSelectedButton(-3);
											setData(programs);
										}
										setValue(currentValue === value ? "" : currentValue);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === directorate ? "opacity-100" : "opacity-0",
										)}
									/>
									{directorate}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
