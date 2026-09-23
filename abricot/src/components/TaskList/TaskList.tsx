import TaskRow from "../TaskRow/TaskRow";
import styles from "./TaskList.module.css";
import type { Task } from "@/types/types";
import { useState } from "react";

interface TaskListProps {
	assignedTasks: Task[];
}

/** Liste des tâches assignées */
export default function TaskList({ assignedTasks }: TaskListProps) {
	const [searchText, setSearchText] = useState("");

	const normalizedSearch = searchText.toLowerCase().trim();
	const filterTask = !normalizedSearch
		? assignedTasks
		: assignedTasks.filter(
				(task) =>
					task.title.toLowerCase().includes(normalizedSearch) ||
					task.description.toLowerCase().includes(normalizedSearch),
			);

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
						onChange={(e) => setSearchText(e.target.value)}
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
				{filterTask.map((task, i) => (
					<TaskRow key={i} task={task} />
				))}
			</div>
		</div>
	);
}
