/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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
import { ArrowUpDown, Check, ChevronDown, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useEffect } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { displayArray } from "@/lib/utils";
import { Button } from "@components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { useDirectorates } from "@context/DirectorateContext";
import { usePrograms } from "@context/ProgramContext";
import { Program, ProgramType } from "@interfaces/program";
import { config } from "dotenv";
import Link from "next/link";
import { toast } from "sonner";
config();

const PDF_BASE_URL = process.env.NEXT_PUBLIC_FILE_URL || "http://172.16.0.195:8080";

enum ColumnName {
	"code" = "Program Kodu",
	"name" = "Program Adı",
	"type" = "Program Türü",
	"users" = "Kurulacak Kişiler",
	"departments" = "Süreç Sahipleri",
}

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

const columns: ColumnDef<Program>[] = [
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
];

export default function ProgramListesi() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
	const [selectedButton, setSelectedButton] = React.useState<number>(-3);
	const [data, setData] = React.useState<Program[]>([]);
	const { getDirectorates, directorates, directoratesLoading } = useDirectorates();
	const { getPrograms, programs } = usePrograms();

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

	useEffect(() => {
		getDirectorates().then((directorates) => {
			getPrograms().then((programs) => {
				// If selectedButton > 0, then filter programs by directorate
				if (selectedButton > -1) {
					setData(
						programs.filter((program) =>
							program.directorateList?.includes(directorates[selectedButton].name!),
						),
					);
				} else {
					setData(programs);
				}
			});
		});
	}, []);

	return (
		<main className="min-h-screen flex flex-col p-4 md:p-12 flex-1">
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
				<h1 className="font-bold text-2xl">Program Listesi</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Tablo üzerinden programları inceleyebilir, dilediğiniz programın detaylarına
					<br />
					program adının üzerine tıklayarak ulaşabilirsiniz. Bu kısımda bütün beyaz liste programları
					<br />
					görüntüleyebilirsiniz.
				</h1>
			</div>
			<div className="mt-6 mb-6 w-full">
				<Button
					key={"hepsi"}
					variant={selectedButton === -3 ? "default" : "outline"}
					className="mr-2 mb-2"
					onClick={() => {
						setData(programs);
						setSelectedButton(-3);
					}}
				>
					Tüm Programlar
				</Button>
				{directorates
					.filter((mudurluk) => !mudurluk.name!.includes("-"))
					.map((mudurluk) => (
						<Button
							key={mudurluk.name}
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
					<Input
						placeholder="Program adı ara..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
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

function Combobox({
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
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const { getDirectorates, directorates, directoratesLoading } = useDirectorates();
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
}
