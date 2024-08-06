"use client";

import { Button } from "@components/ui/button";
import withAuth from "@hoc/withAuth";
import Link from "next/link";
import * as React from "react";

function AdminPanel() {
	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-24 flex-1 justify-center">
			<div className="w-full mb-10 items-center justify-center">
				<h1 className="font-bold text-2xl">Yönetim Paneli</h1>
				<h1
					style={{
						color: "#64748B",
					}}
				>
					Yapmak istediğiniz işlemle alakalı butonlara tıklayarak işlem yapabilirsiniz.
				</h1>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full bg-slate-100 flex-1 rounded-2xl p-8">
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/program-ekle"}
					>
						Program Ekle
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/programlar"}
					>
						Program Listesi
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/mudurluk-ekle"}
					>
						Müdürlük Ekle
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/kullanici-ekle"}
					>
						Yeni Yönetici Ekle
					</Link>
				</Button>
			</div>
		</main>
	);
}

export default withAuth(AdminPanel);
