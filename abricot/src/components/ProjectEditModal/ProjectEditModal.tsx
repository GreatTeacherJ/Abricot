"use client";

import { useState } from "react";
import { Project } from "@/types/types";
import styles from "./ProjectEditModal.module.css";

/** Données renvoyées à l'enregistrement */
export interface ProjectEditData {
	name: string;
	description: string;
}

/** Props de la modale de modification d'un projet */
interface ProjectEditModalProps {
	project: Project;
	isOpen: boolean;
	onClose: () => void;
	onSave?: (data: ProjectEditData) => void;
}

/** Modale de modification d'un projet (maquette Figma « Modale modifier projet ») */
export default function ProjectEditModal({
	project,
	isOpen,
	onClose,
	onSave,
}: ProjectEditModalProps) {
	/** Nom du projet */
	const [name, setName] = useState(project.name);
	/** Description du projet */
	const [description, setDescription] = useState(project.description);

	const membersCount = project.members?.length ?? 0;
	const membersLabel = `${membersCount} collaborateur${
		membersCount > 1 ? "s" : ""
	}`;

	if (!isOpen) return null;

	/** Enregistre les modifications puis ferme la modale */
	const handleSave = () => {
		onSave?.({ name, description });
		onClose();
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="project-edit-title"
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
					<h2 id="project-edit-title" className={styles.title}>
						Modifier un projet
					</h2>

					<div className={styles.fields}>
						{/* Titre */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="project-name">
								Titre*
							</label>
							<div className={styles.control}>
								<input
									id="project-name"
									className={styles.controlInput}
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
						</div>

						{/* Description */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="project-description">
								Description*
							</label>
							<div className={styles.control}>
								<input
									id="project-description"
									className={styles.controlInput}
									type="text"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</div>
						</div>

						{/* Contributeurs */}
						<div className={styles.field}>
							<label className={styles.label} htmlFor="project-members">
								Contributeurs
							</label>
							<div className={styles.control}>
								<input
									id="project-members"
									className={styles.controlInput}
									type="text"
									value={membersLabel}
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
				</div>

				{/* Enregistrer */}
				<button className={styles.saveBtn} onClick={handleSave}>
					Enregistrer
				</button>
			</div>
		</div>
	);
}
