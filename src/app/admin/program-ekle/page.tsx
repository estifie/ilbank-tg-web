"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useDirectorates } from "@context/DirectorateContext";
import { usePrograms } from "@context/ProgramContext";
import withAuth from "@hoc/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
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
	const [visibleDirectorates, setVisibleDirectorates] = useState<{
		bm: string[];
		gm: string[];
		others: string[];
	}>({
		bm: [],
		gm: [],
		others: [],
	});

	useEffect(() => {
		const bm = directorates.filter((mudurluk) => mudurluk.includes("bm-"));
		const gm = directorates.filter((mudurluk) => mudurluk.includes("gm-"));
		const others = directorates.filter((mudurluk) => !mudurluk.includes("-"));

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
		},
	});

	useEffect(() => {
		getDirectorates();
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
					default:
						return "";
				}
			}) || [];

		userList = Array.from(new Set(userList));

		console.log("Program ekleme", values);

		addProgram({
			name: values.programAdi,
			type: values.programTuru,
			users: userList,
			directorateList: values.mudurlukler,
			file: values.file,
		});
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1">
			<div className="w-full mb-10">
				<ArrowLeft className="cursor-pointer mb-6 h-12 w-12" onClick={() => router.push("/admin")} />

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
					onError={(errors) => {
						console.log(errors);
					}}
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
											accept=".pdf"
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
										key={mudurluk}
										control={form.control}
										name="mudurlukler"
										render={({ field }) => {
											return (
												<FormItem
													key={mudurluk}
													className="flex flex-row items-start space-x-3 space-y-0 text-slate-700"
												>
													<FormControl>
														<Checkbox
															checked={field.value?.includes(mudurluk)}
															onCheckedChange={(checked) => {
																return checked
																	? field.onChange([...field.value, mudurluk])
																	: field.onChange(
																			field.value?.filter(
																				(value) => value !== mudurluk,
																			),
																	  );
															}}
														/>
													</FormControl>
													<FormLabel className="font-normal text-slate-700">
														{mudurluk}
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
											{visibleDirectorates.gm.map((mudurluk) => (
												<FormField
													key={mudurluk}
													control={form.control}
													name="mudurlukler"
													render={({ field }) => {
														return (
															<FormItem
																key={mudurluk}
																className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(mudurluk)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						mudurluk,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !== mudurluk,
																						),
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-slate-700">
																	{mudurluk.replace("gm-", "")}
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
											{visibleDirectorates.bm.map((mudurluk) => (
												<FormField
													key={mudurluk}
													control={form.control}
													name="mudurlukler"
													render={({ field }) => {
														return (
															<FormItem
																key={mudurluk}
																className="flex flex-row items-start space-x-3 space-y-0 text-slate-700 mb-2"
															>
																<FormControl>
																	<Checkbox
																		checked={field.value?.includes(mudurluk)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...field.value,
																						mudurluk,
																				  ])
																				: field.onChange(
																						field.value?.filter(
																							(value) =>
																								value !== mudurluk,
																						),
																				  );
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-slate-700">
																	{mudurluk.replace("bm-", "")}
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
					<Button type="submit">Program Ekle</Button>
				</form>
			</Form>
		</main>
	);
}

export default withAuth(ProgramEkle);
