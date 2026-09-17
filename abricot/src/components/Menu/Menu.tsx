"use client";

import styles from "./Menu.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { profilApi } from "@/utils/utilsUser";
import { useEffect, useState } from "react";

const DASHBOARD = "/";
const PROJECT = "/projets";

/** Barre de navigation supérieure (logo, liens, avatar) */
export default function Menu() {
	const pathname = usePathname();
	const router = useRouter();
	const [name, setName] = useState<string>("");

	useEffect(() => {
		async function apiProfil() {
			const data = await profilApi();

			if (data.data) {
				const name = data.data.name;
				const initials = name
					.split(" ")
					.map((w) => w[0])
					.join("");
				setName(initials);
			}
		}
		apiProfil();
	}, []);

	function handleClicDashboard() {
		if (pathname !== DASHBOARD) {
			router.push("/");
		}
	}

	function handleClicProjects() {
		if (pathname !== PROJECT) {
			router.push("/projets");
		}
	}

	return (
		<nav className={styles.nav}>
			{/* Logo de l'application */}
			<Link href="/" className={styles.logo}>
				<Image src="/icon.svg" alt="icon abricot" height={18.72} width={147} />
			</Link>

			{/* Liens de navigation */}
			<div className={styles.navItems}>
				<button
					className={`${styles.navItem} ${pathname === DASHBOARD ? styles.navItemActive : styles.navItemInactive}`}
					onClick={handleClicDashboard}
				>
					<Image
						className={pathname === DASHBOARD ? styles.iconWhite : ""}
						src="/tdbIcon.svg"
						alt=""
						width={24}
						height={24}
					/>
					Tableau de bord
				</button>

				<button
					className={`${styles.navItem} ${pathname === PROJECT ? styles.navItemActive : styles.navItemInactive}`}
					onClick={handleClicProjects}
				>
					<Image
						className={pathname === PROJECT ? styles.iconWhite : ""}
						src="/projetIcon.svg"
						alt=""
						width={29}
						height={22.49}
					/>
					Projets
				</button>
			</div>
			<Link href="/compte">
				{/* Avatar utilisateur */}
				{name ? (
					<div className={styles.userIcon}>{name}</div>
				) : (
					<Image src="/iconAvatar.png" alt="" width={65} height={65} />
				)}
			</Link>
		</nav>
	);
}
