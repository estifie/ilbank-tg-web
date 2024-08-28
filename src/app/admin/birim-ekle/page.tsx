"use client";

import { Button } from "@components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useDepartments } from "@context/DepartmentContext";
import withAuth from "@hoc/withAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	departmanAdi: z.string().min(1, {
		message: "Birim adı boş bırakılamaz.",
	}),
});

function ProgramEkle() {
	const { addDepartment } = useDepartments();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			departmanAdi: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		addDepartment(values.departmanAdi).then(() => {
			router.back();
		});
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-12 md:pt-12 flex-1">
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

				<h1 className="font-bold text-2xl">Yeni Birim Ekle</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Yeni bir birim ekleyin. Eklediğiniz birimlere programlar ekleyebilir ve programlar üzerinde
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
						name="departmanAdi"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-gray-700">Birim Adı</FormLabel>
								<FormControl>
									<Input placeholder="Örn. Birim 1" {...field} className="w-96" />
								</FormControl>
								<FormDescription>Programlarda görünecek birim adı</FormDescription>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-64">
						Birim Ekle
					</Button>
				</form>
			</Form>
		</main>
	);
}

export default withAuth(ProgramEkle);
