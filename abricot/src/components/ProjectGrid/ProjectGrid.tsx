"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./ProjectGrid.module.css";
import { projectsApi } from "@/utils/utilsUser";
import type { Projects } from "@/types/types";
import ProjectCreatModal from "../ProjectCreatModal/ProjectCreatModal";

/** Grille de projets (3 colonnes responsive) */
export default function ProjectGrid() {
	const [projectsList, setProjectList] = useState<Projects | undefined>(undefined);
	//savoir si la modal est ouverte
	const [isOpen, setIsOpen] = useState<boolean>(false);
	//savoir si les projet on été modifié pour le rendering
	const [projectIsModified, setprojectIsModified] = useState<boolean>(false);
	useEffect(() => {
		async function fetchData() {
			const response = await projectsApi();
			setProjectList(response.data);
		}

		fetchData();
	}, [projectIsModified]);

	return (
		<div className={styles.page}>
			{/* En-tête : titre + bouton création */}
			<div className={styles.header}>
				<div className={styles.titleBlock}>
					<h1 className={styles.title}>Mes projets</h1>
					<p className={styles.subtitle}>Gérez vos projets</p>
				</div>
				<button className={styles.createBtn} onClick={() => setIsOpen(true)}>
					+ Créer un projet
				</button>
			</div>
			{/* Grille de cartes projet */}
			<div className={styles.grid}>
				{projectsList &&
					projectsList.map((project, i) => (
						<ProjectCard key={i} project={project} />
					))}
			</div>
			{isOpen && (
				<ProjectCreatModal
					setIsOpen={setIsOpen}
					setprojectIsModified={setprojectIsModified}
				/>
			)}
		</div>
	);
}
