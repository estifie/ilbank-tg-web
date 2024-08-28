"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useDepartments } from "@context/DepartmentContext";
import { useDirectorates } from "@context/DirectorateContext";
import { usePrograms } from "@context/ProgramContext";
import withAuth from "@hoc/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Directorate } from "@interfaces/directorate";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { formSchema, kullaniciTurListesi } from "./formSchema";

function ProgramEkle() {
	const { addProgram } = usePrograms();
	const router = useRouter();
	const { getDirectorates, directorates } = useDirectorates();
	const { getDepartments, departments } = useDepartments();
	const [visibleDirectorates, setVisibleDirectorates] = useState<{
		bm: Directorate[];
		gm: Directorate[];
		others: Directorate[];
	}>({
		bm: [],
		gm: [],
		others: [],
	});

	useEffect(() => {
		const bm = directorates.filter((mudurluk) => mudurluk.name!.includes("bm-"));
		const gm = directorates.filter((mudurluk) => mudurluk.name!.includes("gm-"));
		const others = directorates.filter((mudurluk) => !mudurluk.name!.includes("-"));

		setVisibleDirectorates({ bm, gm, others });
	}, [directorates]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			programAdi: "",
			kullaniciTurleri: [],
			programTuru: "Birim",
			file: null,
			mudurlukler: [],
			birim: [],
		},
	});

	useEffect(() => {
		getDirectorates();
		getDepartments();
	}, []);

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast("Program ekleniyor", {
			description: "Lütfen biraz bekleyin...",
			duration: 2000,
		});
		let userList: string[] =
			values.kullaniciTurleri.map((item: string) => {
				switch (item) {
					case "personel":
						return "Personel";
					case "müdür":
						return "Müdür";
					case "başkan":
						return "Başkan";
					case "baskanUstu":
						return "Başkan Üstü";
					default:
						return "";
				}
			}) || [];

		userList = Array.from(new Set(userList));

		addProgram({
			name: values.programAdi,
			type: values.programTuru,
			users: userList,
			directorateList: values.mudurlukler,
			file: values.file,
			departments: values.birim,
		});
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-12   md:pt-12 flex-1">
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

				<h1 className="font-bold text-2xl">Yeni Program Ekle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Yeni program eklemek için aşağıdaki formu doldurun. Eklediğiniz programlar
					<br />
					herkes tarafından görüntülenebilir ve indirilebilir.
				</h1>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onError={(errors) => {}}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
				>
					<FormField
						control={form.control}
						name="programAdi"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-700">Program Adı</FormLabel>
								<FormControl>
									<Input placeholder="Örn. Adobe Reader" {...field} className="w-96" />
								</FormControl>
								<FormDescription>Programın Görünecek Adı</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="kullaniciTurleri"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-gray-700">Kullanıcı Türleri</FormLabel>
									<FormDescription>
										Programın hangi kullanıcılar tarafından kullanılacağını seçin.
									</FormDescription>
								</div>
								{kullaniciTurListesi.map((tur) => (
									<FormField
										key={tur.id}
										control={form.control}
										name="kullaniciTurleri"
										render={({ field }) => {
											return (
												<FormItem
													key={tur.id}
													className="flex flex-row items-start space-x-3 space-y-0 text-slate-700"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(tur.id)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, tur.id])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== tur.id,
																			),
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal text-slate-700">
														{tur.label}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="programTuru"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel className="text-slate-700">Program Türü</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="Birim" />
											</FormControl>
											<FormLabel className="font-normal text-slate-700">Birim Bazlı</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="Süreç" />
											</FormControl>
											<FormLabel className="font-normal text-slate-700">Süreç Bazlı</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="file"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel className="text-slate-700">PDF Dosyası</FormLabel>
								<FormControl>
									<div className="grid w-full max-w-sm items-center gap-1.5">
										<Input
											id="dosya"
											type="file"
											onChange={(e) => {
												const file = e.target.files?.[0];
												field.onChange(file ? file : "");
											}}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="mudurlukler"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-gray-700">Müdürlükler</FormLabel>
									<FormDescription>
										Programın hangi müdürlükler tarafından kullanılacağını seçin.
									</FormDescription>
								</div>
								{visibleDirectorates.others.map((mudurluk) => (
									<FormField
										key={mudurluk.name!}
										control={form.control}
										name="mudurlukler"
										render={({ field }) => {
											return (
												<FormItem
													key={mudurluk.name!}
													className="flex flex-row items-start space-x-3 space-y-0 text-slate-700"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(mudurluk.name!)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, mudurluk.name!])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== mudurluk.name!,
																			),
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal text-slate-700">
														{mudurluk.name!}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
								<Accordion type="single" collapsible>
									<AccordionItem value="item-1">
										<AccordionTrigger>Genel Müdürlük Alt Bölümleri</AccordionTrigger>
										<AccordionContent>
											<FormField
												key={"all-2"}
												control={form.control}
												name="mudurlukler"
												render={({ field }) => {
													return (
														<FormItem
															key={"all-2"}
															className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															style={{
																display:
																	visibleDirectorates.gm.length === 0 ? "none" : "",
															}}
														>
															<FormControl>
																<Checkbox
																	checked={
																		// Get length of values that has -gm
																		field.value?.reduce(
																			(acc, value) =>
																				value.includes("gm-") ? acc + 1 : acc,
																			0,
																		) === visibleDirectorates.gm.length
																	}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					...visibleDirectorates.gm.map(
																						(mudurluk) => mudurluk.name!,
																					),
																			  ])
																			: field.onChange(
																					field.value?.filter(
																						(value) =>
																							!value.includes("gm-"),
																					),
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className="font-normal text-slate-700">
																{"Tüm Genel Müdürlükler"}
															</FormLabel>
														</FormItem>
													);
												}}
											/>
											{visibleDirectorates.gm.map((mudurluk) => (
												<FormField
													key={mudurluk.name!}
													control={form.control}
													name="mudurlukler"
													render={({ field }) => {
														return (
															<FormItem
																key={mudurluk.name!}
																className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(mudurluk.name!)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						mudurluk.name!,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !==
																								mudurluk.name!,
																						),
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-slate-700">
																	{mudurluk.name!.replace("gm-", "")}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
								<Accordion type="single" collapsible>
									<AccordionItem value="item-1">
										<AccordionTrigger>Bölge Müdürlüğü Alt Bölümleri</AccordionTrigger>
										<AccordionContent>
											<FormField
												key={"all"}
												control={form.control}
												name="mudurlukler"
												render={({ field }) => {
													return (
														<FormItem
															key={"all"}
															className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															style={{
																display:
																	visibleDirectorates.bm.length === 0 ? "none" : "",
															}}
														>
															<FormControl>
																<Checkbox
																	checked={
																		field.value?.reduce(
																			(acc, value) =>
																				value.includes("bm-") ? acc + 1 : acc,
																			0,
																		) === visibleDirectorates.bm.length
																	}
																	onCheckedChange={(checked) => {
																		return checked
																			? field.onChange([
																					...field.value,
																					...visibleDirectorates.bm.map(
																						(mudurluk) => mudurluk.name!,
																					),
																			  ])
																			: // Remove items that contains bm-
																			  field.onChange(
																					field.value?.filter(
																						(value) =>
																							!value.includes("bm-"),
																					),
																			  );
																	}}
																/>
															</FormControl>
															<FormLabel className="font-normal text-slate-700">
																{"Tüm Bölge Müdürlükleri"}
															</FormLabel>
														</FormItem>
													);
												}}
											/>
											{visibleDirectorates.bm.map((mudurluk) => (
												<FormField
													key={mudurluk.name!}
													control={form.control}
													name="mudurlukler"
													render={({ field }) => {
														return (
															<FormItem
																key={mudurluk.name!}
																className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(mudurluk.name!)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						mudurluk.name,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !== mudurluk.name,
																						),
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-slate-700">
																	{mudurluk.name!.replace("bm-", "")}
																</FormLabel>
															</FormItem>
														);
													}}
												/>
											))}
										</AccordionContent>
									</AccordionItem>
								</Accordion>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="birim"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-gray-700">Süreç Sahibi Birim(ler)</FormLabel>
									<FormDescription>
										Programın hangi birimler tarafından kullanılacağını seçin. Birim bazlı
										programlar
										<br />
										için sadece bir süreç sahibi birim seçebilirsiniz. Süreç bazlı programlar için
										<br />
										birden fazla süreç sahibi birim seçebilirsiniz.
									</FormDescription>
								</div>
								<FormField
									key={"all"}
									control={form.control}
									name="birim"
									render={({ field }) => {
										return (
											<FormItem
												style={{
													display: form.getValues("programTuru") === "Birim" ? "none" : "",
												}}
												key={"all"}
												className="flex flex-row items-start space-x-3 space-y-0 text-slate-700"
											>
												<FormControl>
													<Checkbox
														/* if it has all other birimler, check it */
														checked={field.value?.length === departments.length}
														onCheckedChange={(checked) => {
															// If type is "Birim", set field to [birim]
															if (form.getValues("programTuru") !== "Birim") {
																return checked
																	? field.onChange(
																			departments.map((birim) => birim.name),
																	  )
																	: field.onChange([]);
															}
														}}
													/>
												</FormControl>
												<FormLabel className="font-normal text-slate-700">
													{"Tüm Birimler"}
												</FormLabel>
											</FormItem>
										);
									}}
								/>
								{departments.map((birim) => (
									<FormField
										key={birim.name}
										control={form.control}
										name="birim"
										render={({ field }) => {
											return (
												<FormItem
													key={birim.name}
													className="flex flex-row items-start space-x-3 space-y-0 text-slate-700"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(birim.name)}
															onCheckedChange={(checked) => {
																// If type is "Birim", set field to [birim]
																if (form.getValues("programTuru") === "Birim") {
																	return checked
																		? field.onChange([birim.name])
																		: field.onChange([]);
																}

																return checked
																	? field.onChange([...field.value, birim.name])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== birim.name,
																			),
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal text-slate-700">
														{birim.name}
													</FormLabel>
												</FormItem>
											);
										}}
									/>
								))}
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="w-full items-center justify-center">
						<Button type="submit">Program Ekle</Button>
					</div>
				</form>
			</Form>
		</main>
	);
}

export default withAuth(ProgramEkle);
