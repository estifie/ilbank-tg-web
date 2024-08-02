"use client";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@components/ui/navigation-menu"; // Adjust the import based on your setup
import Link from "next/link";
import { useState } from "react";

export default function NavigationBar() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<nav className="bg-blue-500 text-white p-4 fixed w-full top-0 left-0 shadow-md z-50">
			<div className="container mx-auto flex items-center justify-between">
				<div className="text-lg font-bold">
					<Link href="/" legacyBehavior passHref>
						<a className={`${navigationMenuTriggerStyle()} text-xl`}>Home</a>
					</Link>
				</div>
				<div className="hidden md:flex space-x-4">
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link href="/about" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										About
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/services" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Services
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link href="/contact" legacyBehavior passHref>
									<NavigationMenuLink className={navigationMenuTriggerStyle()}>
										Contact
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<button className="md:hidden p-2 focus:outline-none" aria-label="Toggle Menu" onClick={toggleMenu}>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
					</svg>
				</button>
			</div>
			<div
				className={`fixed inset-0 bg-blue-500 text-white p-4 transition-transform transform ${
					isOpen ? "translate-x-0" : "translate-x-full"
				} md:hidden`}
			>
				<button className="absolute top-4 right-4" aria-label="Close Menu" onClick={toggleMenu}>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/about" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>About</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/services" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Services
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/contact" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Contact
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</nav>
	);
}
