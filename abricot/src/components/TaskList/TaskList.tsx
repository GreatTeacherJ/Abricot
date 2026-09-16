import { useEffect } from "react";
import TaskRow from "../TaskRow/TaskRow";
import styles from "./TaskList.module.css";
import { assignedTskApi } from "@/utils/utilsUser";

/** Données fictives des tâches assignées */
const tasks = [
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "à faire" as const,
	},
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "à faire" as const,
	},
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "à faire" as const,
	},
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "à faire" as const,
	},
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "à faire" as const,
	},
	{
		name: "Nom de la tâche",
		description: "Description de la tâche",
		project: "Nom du projet",
		date: "9 mars",
		comments: 2,
		status: "En cours" as const,
	},
];

/** Liste des tâches assignées (vue tableau) */
export default function TaskList() {
	useEffect(() => {
		const data = assignedTskApi();
		console.log("assignedTasks : ", data);
	}, []);

	return (
		<div className={styles.card}>
			{/* En-tête : titre + barre de recherche */}
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<h2 className={styles.headerTitle}>Mes tâches assignées</h2>
					<span className={styles.headerSubtitle}>Par ordre de priorité</span>
				</div>
				<div className={styles.search}>
					<input
						className={styles.searchInput}
						type="text"
						placeholder="Rechercher une tâche"
					/>
					<svg
						className={styles.searchIcon}
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<circle cx="7" cy="7" r="5.5" />
						<path d="M11 11l3.5 3.5" />
					</svg>
				</div>
			</div>

			{/* Liste des lignes de tâches */}
			<div className={styles.taskList}>
				{tasks.map((task, i) => (
					<TaskRow key={i} {...task} />
				))}
			</div>
		</div>
	);
}
