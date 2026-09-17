import KanbanCard from "../KanbanCard/KanbanCard";
import styles from "./KanbanColumn.module.css";
import type { Tasks } from "@/types/types";

interface KanbanColumnProps {
	title: string;
	assignedTasks: Tasks;
}

/** Colonne unique du board Kanban (header + cartes) */
export default function KanbanColumn({ title, assignedTasks }: KanbanColumnProps) {
	return (
		<div className={styles.column}>
			{/* En-tête : titre + compteur */}
			<div className={styles.header}>
				<h3 className={styles.title}>{title}</h3>
				<span className={styles.count}>{assignedTasks.length}</span>
			</div>
			{/* Liste des cartes de tâches */}
			<div className={styles.cards}>
				{assignedTasks.map((task, i) => (
					<KanbanCard key={i} task={task} />
				))}
			</div>
		</div>
	);
}
