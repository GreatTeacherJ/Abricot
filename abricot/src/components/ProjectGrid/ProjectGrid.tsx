"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./ProjectGrid.module.css";
import { projectsApi } from "@/utils/utilsUser";
import type { Projects } from "@/types/types";

/** Grille de projets (3 colonnes responsive) */
export default function ProjectGrid() {
	const [projectsList, setProjectList] = useState<Projects | undefined>(undefined);

	useEffect(() => {
		async function fetchData() {
			const response = await projectsApi();
			console.log(`ProjectGrid :
				message : ${response.message}
				data 	: ${response.data}
				`);
			setProjectList(response.data);
		}

		fetchData();
	}, []);

	return (
		<div className={styles.page}>
			{/* En-tête : titre + bouton création */}
			<div className={styles.header}>
				<div className={styles.titleBlock}>
					<h1 className={styles.title}>Mes projets</h1>
					<p className={styles.subtitle}>Gérez vos projets</p>
				</div>
				<button className={styles.createBtn}>+ Créer un projet</button>
			</div>
			{/* Grille de cartes projet */}
			<div className={styles.grid}>
				{projectsList &&
					projectsList.map((project, i) => (
						<ProjectCard key={i} project={project} />
					))}
			</div>
		</div>
	);
}
