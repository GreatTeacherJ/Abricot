import TaskRow from "../TaskRow/TaskRow";
import styles from "./TaskList.module.css";
import type { Tasks } from "@/types/types";

interface TaskListProps {
	assignedTasks: Tasks;
}

/** Liste des tâches assignées (vue tableau) */
export default function TaskList({ assignedTasks }: TaskListProps) {
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
				{assignedTasks.map((task, i) => (
					<TaskRow key={i} task={task} />
				))}
			</div>
		</div>
	);
}
