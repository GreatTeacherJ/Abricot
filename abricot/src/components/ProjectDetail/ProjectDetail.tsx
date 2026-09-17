"use client";

import Link from "next/link";
import ProjectTaskCard from "../ProjectTaskCard/ProjectTaskCard";
import Contributors from "../Contributors/Contributors";
import styles from "./ProjectDetail.module.css";
import { useState, useEffect } from "react";
import type { Tasks, Project } from "@/types/types";
import { taskForProjectApi, projectsApi } from "@/utils/utilsUser";
import Image from "next/image";

/** Props de la page de détail d'un projet */
interface ProjectDetailProps {
	id: string;
}

/** Page de détail d'un projet : tâches, contributeurs, actions */
export default function ProjectDetail({ id }: ProjectDetailProps) {
	const [tasks, setTasks] = useState<Tasks>([]);
	const [project, setProjects] = useState<Project>();

	useEffect(() => {
		async function taskForProject() {
			const data = await taskForProjectApi(id);

			if (!data.data) {
				console.log("ProjectCard : ", data.message);
				return;
			}
			setTasks(data.data);
		}

		async function apiProject() {
			const data = await projectsApi();

			if (!data.data) {
				console.log("ProjectCard : ", data.message);
				return;
			}

			const projects = data.data;
			const project = projects.filter((project) => project.id === id);

			//on prend le premier élément car la ne devrait avoir qu'un seul projet
			setProjects(project[0]);
		}

		taskForProject();
		apiProject();
	}, []);

	if (!project) {
		return <p>Aucun projet trouvé</p>;
	}

	return (
		<div className={styles.page}>
			{/* En-tête : bouton retour + titre + lien modifier */}
			<div className={styles.projectHeader}>
				<Link href="/projets" className={styles.backBtn}>
					<svg
						className={styles.backIcon}
						viewBox="0 0 15 15"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M10 1L3 7.5L10 14" />
					</svg>
				</Link>
				<div className={styles.headerInfo}>
					<div className={styles.titleRow}>
						<h1 className={styles.title}>{project.name}</h1>
						<span className={styles.editLink}>Modifier</span>
					</div>
					<p className={styles.projectDesc}>{project.description}</p>
				</div>
				{/* Boutons d'action : créer tâche + IA */}
				<div className={styles.actionButtons}>
					<button className={styles.createBtn}>Créer une tâche</button>
					<button className={styles.aiBtn}>
						<svg
							className={styles.aiStar}
							viewBox="0 0 21 21"
							fill="currentColor"
						>
							<path d="M10.5 0l2.4 7.4h7.6l-6.1 4.5 2.4 7.4L10.5 14.8l-6.2 4.5 2.4-7.4L.6 7.4h7.6z" />
						</svg>
						IA
					</button>
				</div>
			</div>
			{/* Barre des contributeurs */}
			<Contributors project={project} />

			{/* Carte principale : onglets + filtres + liste de tâches */}
			<div className={styles.contentCard}>
				<div className={styles.contentHeader}>
					<div className={styles.contentTitle}>
						<h2 className={styles.sectionTitle}>Tâches</h2>
						<span className={styles.sectionSubtitle}>
							Par ordre de priorité
						</span>
					</div>
					<div className={styles.controls}>
						{/* Onglets Liste/Calendrier */}
						<div className={styles.chips}>
							<button className={`${styles.chip} ${styles.chipActive}`}>
								<Image
									src="/listIcon.svg"
									alt=""
									width={16}
									height={16}
								/>
								Liste
							</button>
							<button className={`${styles.chip} ${styles.chipInactive}`}>
								<Image
									src="/kanbanIcon.svg"
									alt=""
									width={16}
									height={16}
								/>
								Calendrier
							</button>
						</div>
						{/* Filtre par statut */}
						<button className={styles.filterBtn}>
							Statut
							<svg
								className={styles.filterChevron}
								viewBox="0 0 16 8"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M1 1l7 6 7-6" />
							</svg>
						</button>
						{/* Barre de recherche */}
						<div className={styles.search}>
							<svg
								className={styles.searchIcon}
								viewBox="0 0 14 14"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<circle cx="6" cy="6" r="5" />
								<path d="M10 10l3 3" />
							</svg>
							<input
								className={styles.searchInput}
								type="text"
								placeholder="Rechercher une tâche"
							/>
						</div>
					</div>
				</div>

				{/* Liste des tâches du projet */}
				<div className={styles.taskList}>
					{tasks.map((task, i) => (
						<ProjectTaskCard key={i} task={task} />
					))}
				</div>
			</div>
		</div>
	);
}
