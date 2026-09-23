"use client";

import styles from "./Menu.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useParams } from "next/navigation";
import { profilApi } from "@/utils/utilsUser";
import { useEffect, useState } from "react";

const PROJECT = "/projets";

/** Barre de navigation supérieure (logo, liens, avatar) */
export default function Menu() {
	const pathname = usePathname();
	const router = useRouter();
	const [userName, setName] = useState<string>("");

	const params = useParams();
	const routeName = params.name as string;

	useEffect(() => {
		async function apiProfil() {
			const data = await profilApi();

			if (data.success) {
				const userName = data.data.user.name;
				const initials = userName
					.split(" ")
					.map((w) => w[0])
					.join("");
				setName(initials);
			}
		}
		apiProfil();
	}, []);

	function handleClicDashboard() {
		if (pathname !== "/" + routeName) {
			router.push("/" + routeName);
		}
	}

	function handleClicProjects() {
		if (pathname !== "/" + routeName + PROJECT) {
			router.push(`/${routeName}${PROJECT}`);
		}
	}

	return (
		<nav className={styles.nav}>
			{/* Logo de l'application */}
			<Link href={"/" + routeName} className={styles.logo}>
				<Image src="/icon.svg" alt="icon abricot" height={18.72} width={147} />
			</Link>

			{/* Liens de navigation */}
			<div className={styles.navItems}>
				<button
					className={`${styles.navItem} ${pathname === "/" + routeName ? styles.navItemActive : styles.navItemInactive}`}
					onClick={handleClicDashboard}
				>
					<Image
						className={pathname === "/" + routeName ? styles.iconWhite : ""}
						src="/tdbIcon.svg"
						alt=""
						width={24}
						height={24}
					/>
					Tableau de bord
				</button>

				<button
					className={`${styles.navItem} ${pathname === "/" + routeName + PROJECT ? styles.navItemActive : styles.navItemInactive}`}
					onClick={handleClicProjects}
				>
					<Image
						className={
							pathname === "/" + routeName + PROJECT ? styles.iconWhite : ""
						}
						src="/projetIcon.svg"
						alt=""
						width={29}
						height={22.49}
					/>
					Projets
				</button>
			</div>
			<Link href={"/" + routeName + "/compte"}>
				{/* Avatar utilisateur */}
				{userName ? (
					<div className={styles.userIcon}>{userName}</div>
				) : (
					<Image src="/iconAvatar.png" alt="" width={65} height={65} />
				)}
			</Link>
		</nav>
	);
}
