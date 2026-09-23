"use client";

import Link from "next/link";
import ProjectTaskCard from "../ProjectTaskCard/ProjectTaskCard";
import Contributors from "../Contributors/Contributors";
import styles from "./ProjectDetail.module.css";
import { useState, useEffect } from "react";
import type { Task, Project } from "@/types/types";
import { taskForProjectApi, projectsApi } from "@/utils/utilsUser";
import Image from "next/image";
import { useParams } from "next/navigation";
import TaskEditModal from "../TaskEditModal/TaskEditModal";
import ProjectEditModal from "../ProjectEditModal/ProjectEditModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import TaskCreateModal from "../TaskCreateModal/TaskCreateModal";
import { useProvider } from "../Provider/Provider";

/** Props de la page de détail d'un projet */
interface ProjectDetailProps {
	id: string;
}

/** Page de détail d'un projet : tâches, contributeurs, actions */
export default function ProjectDetail({ id }: ProjectDetailProps) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [project, setProjects] = useState<Project>();
	const [selectedStatus, setSelectedStatus] = useState("ALL");
	const [searchText, setsearchText] = useState<string>("");
	const [openCrtTsk, setOpenCrtTsk] = useState<boolean>(false);
	const params = useParams();
	const routeName = params.name as string;
	const [cmtIsModfified, setCmtIsModfified] = useState<boolean>(false);

	//pour l'ouverture des modale je passe l'id qui me dit que je doit
	// ouvrire la modale quand l'id est vide la modale est fermée
	//Ouverture modale modif projet
	const [idProjectModified, setidProjectModified] = useState<string>("");
	//Ouverture modale suppression projet
	const [idProjectDeleted, setidProjectDeleted] = useState<string>("");
	//ouvertur modale modif tâche
	const [idTaskModified, setidTaskModified] = useState<string>("");

	const STATUS_OPTIONS = [
		{ value: "TODO", label: "À faire" },
		{ value: "IN_PROGRESS", label: "En cours" },
		{ value: "DONE", label: "Terminé" },
		{ value: "ALL", label: "Statut" },
	];

	const { currentUser, setRendering, rendering } = useProvider();
	const isOwner = project?.owner.id === currentUser?.id;
	console.log("propriétaire : ", project?.owner.name, " / user : ", currentUser?.name);

	const filterTaskStatus =
		selectedStatus === "ALL"
			? tasks
			: tasks.filter((task) => task.status === selectedStatus);

	const normalizedSearch = searchText.toLowerCase().trim();

	const filterTask = !normalizedSearch
		? filterTaskStatus
		: filterTaskStatus.filter(
				(task) =>
					task.title.toLowerCase().includes(normalizedSearch) ||
					task.description.toLowerCase().includes(normalizedSearch),
			);

	//apelle API recuperer les taches
	useEffect(() => {
		async function taskForProject() {
			const data = await taskForProjectApi(id);

			if (!data.success) {
				return;
			}
			setTasks(data.data.tasks);
		}

		async function apiProject() {
			const data = await projectsApi();

			if (!data.success) {
				return;
			}

			const projects = data.data;
			const project = projects.projects.filter((project) => project.id === id);

			//on prend le premier élément car la ne devrait avoir qu'un seul projet
			setProjects(project[0]);
		}

		taskForProject();
		apiProject();
	}, [cmtIsModfified, rendering, id]);

	if (!project) {
		return <p>Aucun projet trouvé</p>;
	}

	return (
		<div className={styles.page}>
			{/* En-tête : bouton retour + titre + lien modifier */}
			<div className={styles.projectHeader}>
				<Link href={"/" + routeName + "/projets"} className={styles.backBtn}>
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
						{isOwner && (
							<button
								className={styles.editLink}
								onClick={() => setidProjectModified(project.id)}
							>
								Modifier
							</button>
						)}
					</div>
					<p className={styles.projectDesc}>{project.description}</p>
				</div>
				{/* Boutons d'action : créer tâche + IA */}
				<div className={styles.actionButtons}>
					{isOwner && (
						<button
							className={styles.editLink}
							onClick={() => setidProjectDeleted(project.id)}
						>
							Supprimer
						</button>
					)}
					<button
						className={styles.createBtn}
						onClick={() => setOpenCrtTsk(true)}
					>
						Créer une tâche
					</button>
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
						<div className={styles.wrapper}>
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className={styles.select}
							>
								{STATUS_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<svg
								className={styles.arrow}
								viewBox="0 0 16 8"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M1 1l7 6 7-6" />
							</svg>
						</div>

						{/* Barre de recherche */}
						<div className={styles.search}>
							<input
								className={styles.searchInput}
								type="text"
								placeholder="Rechercher une tâche"
								onChange={(e) => setsearchText(e.target.value)}
							/>
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
						</div>
					</div>
				</div>

				{/* Liste des tâches du projet */}
				<div className={styles.taskList}>
					{filterTask.map((task, i) => (
						<ProjectTaskCard
							key={i}
							task={task}
							setidTaskModified={setidTaskModified}
							setCmtIsModfified={setCmtIsModfified}
						/>
					))}
				</div>
			</div>

			{
				/*Modale modfier tache */
				idTaskModified && (
					<TaskEditModal
						task={tasks.filter((task) => task.id === idTaskModified)[0]}
						setidTaskModified={setidTaskModified}
						setPrjIsModfified={setCmtIsModfified}
					/>
				)
			}

			{
				/*Modale créer tache */
				openCrtTsk && (
					<TaskCreateModal
						idProject={id}
						setRendering={setRendering}
						setOpenCrtTsk={setOpenCrtTsk}
					/>
				)
			}

			{
				/*Modale Modfier projet */
				idProjectModified && (
					<ProjectEditModal
						project={project}
						setIdProjectModified={setidProjectModified}
						setPrjIsModfified={setRendering}
					/>
				)
			}

			{
				/*Modale Supprimer projet */
				idProjectDeleted && (
					<DeleteModal
						project={project}
						setIdProjectDeleted={setidProjectDeleted}
						setPrjIsModfified={setRendering}
					/>
				)
			}
		</div>
	);
}
