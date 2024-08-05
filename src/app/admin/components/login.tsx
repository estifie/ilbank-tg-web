import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { useAuth } from "@context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
	const { login } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		login(values);
	}

	return (
		<div className="flex items-center">
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
					<Button type="submit">Giriş Yap</Button>
				</form>
			</Form>
		</div>
	);
}
