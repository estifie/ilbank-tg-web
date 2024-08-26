"use client";

import { Button } from "@components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import anaMudurlukKategorileri from "@constants/anaMudurlukKategorileri";
import { useDirectorates } from "@context/DirectorateContext";
import withAuth from "@hoc/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	mudurlukAdi: z.string().min(1, {
		message: "Müdürlük adı boş bırakılamaz.",
	}),
	anaKategori: z.enum(["none", "gm", "bm"], {
		required_error: "Ana kategori seçmelisiniz.",
	}),
});

function ProgramEkle() {
	const { addDirectorate } = useDirectorates();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			mudurlukAdi: "",
			anaKategori: "none",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// If values.anaKategori is "none", then we should not add it to the directorate name
		const anaKategori = values.anaKategori === "none" ? "" : values.anaKategori + "-";
		addDirectorate(anaKategori + values.mudurlukAdi).then(() => {
			router.back();
		});
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1">
			<div className="w-full mb-10">
				<ArrowLeft className="cursor-pointer mb-6 h-12 w-12" onClick={() => router.back()} />

				<h1 className="font-bold text-2xl">Yeni Müdürlük Ekle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Yeni bir müdürlük ekleyin. Eklediğiniz müdürlüklere programlar ekleyebilir ve programlar üzerinde
					<br />
					değişiklik yapabilirsiniz.
				</h1>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8 w-full"
				>
					<FormField
						control={form.control}
						name="mudurlukAdi"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-700">Müdürlük Adı</FormLabel>
								<FormControl>
									<Input placeholder="Örn. Genel Müdürlük" {...field} className="w-96" />
								</FormControl>
								<FormDescription>Programlarda görünecek müdürlük adı</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="anaKategori"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-700">Ana Kategori</FormLabel>
								<div className="flex space-x-4">
									<Label key={"none"} className="flex items-center space-x-2">
										<Input
											type="radio"
											{...field}
											value={"none"}
											className="w-4 h-4 checked:bg-slate-700"
										/>
										<span>{"Ana Kategori Yok"}</span>
									</Label>

									{anaMudurlukKategorileri.map((item) => (
										<Label key={item.id} className="flex items-center space-x-2">
											<Input
												type="radio"
												{...field}
												value={item.id}
												className="w-4 h-4 checked:bg-slate-700"
											/>
											<span>{item.label}</span>
										</Label>
									))}
								</div>
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-64">
						Müdürlük Ekle
					</Button>
					<Label className="text-gray-700">
						Müdürlükler daha sonradan düzenlenemez. Bu sebeple
						<br />
						ekleme işlemini dikkatli yapınız.
					</Label>
				</form>
			</Form>
		</main>
	);
}

export default withAuth(ProgramEkle);
