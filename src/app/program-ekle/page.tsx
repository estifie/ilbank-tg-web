"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";

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

const formSchema = z.object({
	programKodu: z
		.string()
		.min(1, {
			message: "Program kodu boş bırakılamaz.",
		})
		.max(255, {
			message: "Program kodu en fazla 255 karakter olmalıdır.",
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
});

export default function ProgramEkle() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			programKodu: "",
			programAdi: "",
			kullaniciTurleri: [],
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="programKodu"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Program Kodu</FormLabel>
								<FormControl>
									<Input placeholder="Örn. BB0" {...field} />
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
								<FormLabel>Program Adı</FormLabel>
								<FormControl>
									<Input placeholder="Örn. Adobe Reader" {...field} />
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
									<FormLabel>Kullanıcı Türleri</FormLabel>
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
													className="flex flex-row items-start space-x-3 space-y-0"
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
													<FormLabel className="font-normal">{tur.label}</FormLabel>
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
								<FormLabel>Program Türü</FormLabel>
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
											<FormLabel className="font-normal">Birim Bazlı</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="sb" />
											</FormControl>
											<FormLabel className="font-normal">Süreç Bazlı</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
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
