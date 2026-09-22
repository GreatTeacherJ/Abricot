import styles from "./KanbanCard.module.css";
import type { Task } from "@/types/types";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

interface KanbanCardProps {
	task: Task;
}

/** Carte de tâche unique dans une colonne Kanban */
export default function KanbanCard({ task }: KanbanCardProps) {
	const params = useParams();
	const routeName = params.name as string;

	const date = new Date(task.dueDate);
	// Forcer l'interprétation en UTC pour éviter le décalage
	const formattedDate = new Intl.DateTimeFormat("fr-FR", {
		month: "long",
		year: "numeric",
		timeZone: "UTC", // évite le décalage de fuseau horaire
	}).format(date);

	const statusStyle: Record<string, { label: string; className: string }> = {
		TODO: { label: "À faire", className: styles.tagRed },
		IN_PROGRESS: { label: "En cour", className: styles.tagOrange },
		DONE: { label: "Terminée", className: styles.tagGreen },
	};

	return (
		<div className={styles.card}>
			{/* En-tête : nom + tag statut */}
			<div className={styles.header}>
				<span className={styles.name}>{task.title}</span>
				<span className={`${styles.tag} ${statusStyle[task.status].className}`}>
					{statusStyle[task.status].label}
				</span>
			</div>
			<span className={styles.description}>{task.description}</span>
			{/* Pied de page : métadonnées + bouton voir */}
			<div className={styles.footer}>
				<div className={styles.meta}>
					<span className={styles.metaItem}>
						<Image src="/grayFolder.svg" alt="" width={18} height={18} />
						{task.project.name}
					</span>
					<span className={styles.metaItem}>
						<Image src="/grayCalandar.svg" alt="" width={18} height={18} />
						{formattedDate}
					</span>
					<span className={styles.metaItem}>
						<Image src="/grayComments.svg" alt="" width={18} height={18} />
						{task.comments.length}
					</span>
				</div>
				<Link
					href={"/" + routeName + "/projets/" + task.project.id + "#" + task.id}
				>
					<button className={styles.viewBtn} onClick={() => {}}>
						Voir
					</button>
				</Link>
			</div>
		</div>
	);
}
