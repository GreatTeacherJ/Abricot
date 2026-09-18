"use client";

import { useState } from "react";
import { Task } from "@/types/types";
import styles from "./TaskEditModal.module.css";

/** Statuts disponibles avec leur libellé et leur style de tag */
const STATUSES: { value: Task["status"]; label: string; className: string }[] = [
	{ value: "TODO", label: "À faire", className: styles.tagRed },
	{ value: "IN_PROGRESS", label: "En cours", className: styles.tagOrange },
	{ value: "DONE", label: "Terminée", className: styles.tagGreen },
];

/** Données renvoyées à l'enregistrement */
export interface TaskEditData {
	title: string;
	description: string;
	dueDate: string;
	status: Task["status"];
}

/** Props de la modale de modification d'une tâche */
interface TaskEditModalProps {
	task: Task;
	isOpen: boolean;
	onClose: () => void;
	onSave?: (data: TaskEditData) => void;
}

/** Modale de modification d'une tâche (maquette Figma « Modale modifier une tâche ») */
export default function TaskEditModal({
	task,
	isOpen,
	onClose,
	onSave,
}: TaskEditModalProps) {
	/** Titre de la tâche */
	const [title, setTitle] = useState(task.title);
	/** Description de la tâche */
	const [description, setDescription] = useState(task.description);
	/** Échéance affichée (jour + mois) */
	const [dueDate, setDueDate] = useState(
		new Intl.DateTimeFormat("fr-FR", {
			day: "numeric",
			month: "long",
			timeZone: "UTC",
		}).format(new Date(task.dueDate)),
	);
	/** Statut sélectionné */
	const [status, setStatus] = useState<Task["status"]>(task.status);

	const assigneesCount = task.assignees?.length ?? 0;
	const assigneesLabel = `${assigneesCount} collaborateur${
		assigneesCount > 1 ? "s" : ""
	}`;

	if (!isOpen) return null;

	/** Enregistre les modifications puis ferme la modale */
	const handleSave = () => {
		onSave?.({ title, description, dueDate, status });
		onClose();
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="task-edit-title"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Fermeture */}
				<button
					className={styles.closeBtn}
					onClick={onClose}
					aria-label="Fermer"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 14 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1 1L13 13M13 1L1 13"
							stroke="currentColor"
							strokeWidth="1"
							strokeLinecap="round"
						/>
					</svg>
				</button>

				{/* Contenu */}
				<div className={styles.content}>
					<h2 id="task-edit-title" className={styles.title}>
						Modifier
					</h2>

					<div className={styles.fields}>
						{/* Titre */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="task-title">
								Titre
							</label>
							<div className={styles.control}>
								<input
									id="task-title"
									className={styles.controlInput}
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
						</div>

						{/* Description */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="task-description">
								Description
							</label>
							<div className={styles.control}>
								<input
									id="task-description"
									className={styles.controlInput}
									type="text"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
						</div>

						{/* Échéance */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="task-due-date">
								Échéance
							</label>
							<div className={styles.control}>
								<input
									id="task-due-date"
									className={styles.controlInput}
									type="text"
									value={dueDate}
									onChange={(e) => setDueDate(e.target.value)}
								/>
								<svg
									className={styles.calendarIcon}
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									xmlns="http://www.w3.org/2000/svg"
								>
									<rect x="3" y="4" width="18" height="17" rx="2" />
									<path d="M3 9h18M8 2v4M16 2v4" />
								</svg>
							</div>
						</div>

						{/* Assignés */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="task-assignees">
								Assigné à :
							</label>
							<div className={styles.control}>
								<input
									id="task-assignees"
									className={styles.controlInput}
									type="text"
									value={assigneesLabel}
									readOnly
								/>
								<svg
									className={styles.chevronIcon}
									width="16"
									height="8"
									viewBox="0 0 16 8"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M1 1L8 7L15 1"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Statut */}
					<div className={styles.statusBlock}>
						<span className={styles.label}>Statut :</span>
						<div className={styles.tags}>
							{STATUSES.map((s) => (
								<button
									key={s.value}
									type="button"
									className={`${styles.tag} ${s.className}`}
									onClick={() => setStatus(s.value)}
									aria-pressed={status === s.value}
								>
									{s.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Enregistrer */}
				<button className={styles.saveBtn} onClick={handleSave}>
					Enregistrer
				</button>
			</div>
		</div>
	);
}
