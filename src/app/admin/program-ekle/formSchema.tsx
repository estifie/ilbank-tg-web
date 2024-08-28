import { z } from "zod";

const isFile = (value: any) => value instanceof File;

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
	file: z
		.any()
		.refine(isFile, {
			message: "Bir dosya seçmelisiniz.",
		})
		.nullable(),
	mudurlukler: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "En az bir müdürlük seçmelisiniz.",
	}),
	birim: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "En az süreç sahibi seçmelisiniz.",
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
	{
		id: "baskanUstu",
		label: "Başkan Üstü",
	},
] as const;
