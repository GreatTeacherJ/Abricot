"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./ProjectGrid.module.css";
import { projectsApi } from "@/utils/utilsUser";
import type { Project } from "@/types/types";
import PageHeader from "../PageHeader/PageHeader";

/** Grille de projets (3 colonnes responsive) */
export default function ProjectGrid() {
	const [projectsList, setProjectList] = useState<Project[]>([]);

	//savoir si les projet on été modifié pour le rendering
	const [isRerender, setIsRerender] = useState<boolean>(false);
	useEffect(() => {
		async function fetchData() {
			const response = await projectsApi();
			if (!response.success) {
				return;
			}
			setProjectList(response.data.projects);
		}

		fetchData();
	}, [isRerender]);

	return (
		<>
			{/* En-tête : titre + bouton création */}
			<PageHeader setIsRerender={setIsRerender} />
			<div className={styles.page}>
				{/* Grille de cartes projet */}
				<div className={styles.grid}>
					{projectsList &&
						projectsList.map((project, i) => (
							<ProjectCard key={i} project={project} />
						))}
				</div>
			</div>
		</>
	);
}
