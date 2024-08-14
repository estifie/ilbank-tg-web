import { z } from "zod";

export const formSchema = z.object({
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
	programTuru: z.enum(["Birim", "Süreç"], {
		required_error: "Program türü seçmelisiniz.",
	}),
	file: z.instanceof(File).nullable(), // PDF dosyası
	mudurlukler: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "En az bir müdürlük seçmelisiniz.",
	}),
});

export const kullaniciTurListesi = [
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
