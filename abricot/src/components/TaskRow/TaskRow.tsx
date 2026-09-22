"use client";

import { Task } from "@/types/types";
import styles from "./TaskRow.module.css";
import Image from "next/image";
import { useState } from "react";

/** Props d'une ligne de tâche (vue tableau) */
interface TaskRowProps {
	task: Task;
}

/** Ligne de tâche unique dans la vue tableau */
export default function TaskRow({ task }: TaskRowProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

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
		<div className={styles.row}>
			{/* Infos principales : nom, description, métadonnées */}
			<div className={styles.info}>
				<div className={styles.nameBlock}>
					<span className={styles.name}>{task.title}</span>
					<span className={styles.description}>{task.project.description}</span>
				</div>
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
			</div>

			{/* Actions : tag statut + bouton voir */}
			<div className={styles.actions}>
				<div className={styles.header}>
					<span
						className={`${styles.tag} ${statusStyle[task.status].className}`}
					>
						{statusStyle[task.status].label}
					</span>
				</div>
				<button className={styles.viewBtn}>Voir</button>
			</div>
		</div>
	);
}
