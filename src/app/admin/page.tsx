"use client";

import { Button } from "@components/ui/button";
import withAuth from "@hoc/withAuth";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import * as React from "react";

function AdminPanel() {
	const router = useRouter();

	return (
		<main className="min-h-screen flex flex-col items-center p-4 md:p-12   md:pt-12 flex-1 justify-center">
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
						href={"/admin/programlar"}
					>
						Program İşlemleri
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/mudurluk"}
					>
						Müdürlük İşlemleri
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/birim"}
					>
						Birim İşlemleri
					</Link>
				</Button>
				<Button className="flex-1 h-full" variant={"outline"}>
					<Link
						className="flex sm:text-base text-xl font-semibold w-full h-full justify-center items-center"
						href={"/admin/kullanici-ekle"}
					>
						Yeni Yönetici Ekle
					</Link>
				</Button>
			</div>
		</main>
	);
}

export default withAuth(AdminPanel);
