"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import withAuth from "@hoc/withAuth";

const kullaniciTurListesi = [
	{
		id: "personel",
		label: "Personel",
	},
	{
		id: "müdür",
		label: "Müdür",
	},
	{
		id: "başkan",
		label: "Başkan",
	},
] as const;

const demoMudurlukler = [
	"Beyaz Liste",
	"Genel Müdürlük",
	"Bölge Müdürlüğü",
	"İnsan Kaynakları ve Destek Hizmetleri Müdürlüğü",
	"Bankacılık ve Muhasebe Müdürlüğü",
	"Mekansal Planlama Müdürlüğü",
	"Yapım Uygulamaları Müdürlüğü",
];

const formSchema = z.object({
	programKodu: z
		.string()
		.min(1, {
			message: "Program kodu boş bırakılamaz.",
		})
		.max(255, {
			message: "Program kodu en fazla 255 karakter olmalıdır.",
		})
		.refine((value) => /^SB\d+$/.test(value) || /^BB\d+$/.test(value), {
			message: "Program kodu SB veya BB ile başlamalıdır.",
		}),
	programAdi: z
		.string()
		.min(1, {
			message: "Program adı boş bırakılamaz.",
		})
		.max(255, {
			message: "Program adı en fazla 255 karakter olmalıdır.",
		}),
	kullaniciTurleri: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "En az bir kullanıcı türü seçmelisiniz.",
	}),
	programTuru: z.enum(["bb", "sb"], {
		required_error: "Program türü seçmelisiniz.",
	}),
	file: z
		.string()
		.optional()
		.refine((value) => value?.endsWith(".pdf"), {
			message: "Bir PDF dosyası seçmelisiniz.",
		}),
	mudurlukler: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "En az bir müdürlük seçmelisiniz.",
	}),
});

function ProgramEkle() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			programKodu: "",
			programAdi: "",
			kullaniciTurleri: [],
			programTuru: undefined,
			file: "",
			mudurlukler: [],
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1">
			<div className="w-full mb-10">
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
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
				>
					<FormField
						control={form.control}
						name="programKodu"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-700">Program Kodu</FormLabel>
								<FormControl>
									<Input placeholder="Örn. BB0" {...field} className="w-96" />
								</FormControl>
								<FormDescription>Programın Görünecek Kodu</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
												<RadioGroupItem value="bb" />
											</FormControl>
											<FormLabel className="font-normal text-slate-700">Birim Bazlı</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="sb" />
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
												field.onChange(file ? file.name : "");
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
								{demoMudurlukler.map((mudurluk) => (
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
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Oluştur</Button>
				</form>
			</Form>
		</main>
	);
}

export default withAuth(ProgramEkle);
