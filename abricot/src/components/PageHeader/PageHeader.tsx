"use client";

import styles from "./PageHeader.module.css";
import { usePathname, useParams } from "next/navigation";
import { useProvider } from "../Provider/Provider";
import ProjectCreatModal from "../ProjectCreatModal/ProjectCreatModal";
import { Dispatch, SetStateAction } from "react";

interface Props {
	setIsRerender: Dispatch<SetStateAction<boolean>>;
}

/** En-tête du dashboard : titre, chips de vue, bouton création */
export default function PageHeader({ setIsRerender }: Props) {
	const pathname = usePathname();
	const params = useParams();
	const routeName = params.name as string;
	let title = "";
	let desc = "";

	const { currentUser } = useProvider();

	if (pathname === "/" + routeName) {
		title = "Tableau de bord";
		desc =
			"Bonjour " + currentUser?.name + ",voici un aperçu de vos projets et tâches";
	} else {
		title = "Mes projets";
		desc = "Gérez vos projets";
	}

	return (
		<div className={styles.header}>
			{/* Titre et sous-titre */}
			<div className={styles.titleBlock}>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.subtitle}>{desc}</p>
			</div>
			<ProjectCreatModal setIsRerender={setIsRerender} />
		</div>
	);
}
