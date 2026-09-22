import KanbanColumn from "../KanbanColumn/KanbanColumn";
import styles from "./KanbanBoard.module.css";
import type { Tasks } from "@/types/types";

interface KanbanBoardProps {
	assignedTasks: Tasks;
}

/** Board Kanban avec 3 colonnes : À faire, En cours, Terminées */
export default function KanbanBoard({ assignedTasks }: KanbanBoardProps) {
	const inProgress = assignedTasks.filter((task) => task.status === "IN_PROGRESS");
	const todo = assignedTasks.filter((task) => task.status === "TODO");
	const done = assignedTasks.filter((task) => task.status === "DONE");

	return (
		<div className={styles.board}>
			<KanbanColumn title="À faires" assignedTasks={todo} />
			<KanbanColumn title="En cours" assignedTasks={inProgress} />
			<KanbanColumn title="Términées" assignedTasks={done} />
		</div>
	);
}
