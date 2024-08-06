import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useAuth } from "@context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
	username: z
		.string()
		.min(1, {
			message: "Kullanıcı adı boş bırakılamaz.",
		})
		.max(255, {
			message: "Kullanıcı adı en fazla 255 karakter olmalıdır.",
		}),
	password: z
		.string()
		.min(1, {
			message: "Şifre boş bırakılamaz.",
		})
		.max(255, {
			message: "Şifre en fazla 255 karakter olmalıdır.",
		}),
});

export default function Login() {
	const { login, loading } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast("Giriş yapılıyor", {
			description: "Lütfen biraz bekleyin...",
		});
		login(values);
	}

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1 justify-center">
			<div className="flex items-center flex-col justify-center mb-[6vw]">
				<Image
					src="/logo.png"
					alt="Logo"
					width={283}
					height={324}
					className="mb-8"
					style={{
						width: "10vw",
						height: "10vw",
						userSelect: "none",
						pointerEvents: "none",
					}}
					draggable={false}
				/>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem className="mb-8">
									<FormLabel className="text-gray-700">Kullanıcı Adı</FormLabel>
									<FormControl>
										<Input placeholder="Kullanıcı adınızı girin..." {...field} className="w-96" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="mb-8">
									<FormLabel className="text-gray-700">Şifre</FormLabel>
									<FormControl>
										<Input placeholder="Şifrenizi girin..." {...field} className="w-96" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{loading ? (
							<Button disabled>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Lütfen bekleyin...
							</Button>
						) : (
							<Button type="submit">Giriş Yap</Button>
						)}
					</form>
				</Form>
			</div>
		</main>
	);
}
