"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/types";
import styles from "./DeleteModal.module.css";
import { deleteProjectApi } from "@/utils/utilsProject";

/** Props de la modale de suppression d'un projet */
interface DeleteModalProps {
	project: Project;
	setIdProjectDeleted: Dispatch<SetStateAction<string>>;
	setPrjIsModfified: Dispatch<SetStateAction<boolean>>;
}

/** Modale de confirmation de suppression d'un projet */
export default function DeleteModal({
	project,
	setIdProjectDeleted,
	setPrjIsModfified,
}: DeleteModalProps) {
	//message d'erreur
	const [error, setError] = useState<string>("");
	//empêche le double clic pendant la suppression
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const router = useRouter();
	const params = useParams();
	const routeName = params.name as string;

	function onClose() {
		setIdProjectDeleted("");
	}

	/** Supprime le projet puis redirige vers la liste des projets */
	async function handleDelete() {
		setIsDeleting(true);
		setError("");

		const response = await deleteProjectApi(project.id);

		if (!response.success) {
			setError(response.message);
			setIsDeleting(false);
			return;
		}

		setPrjIsModfified((prev) => !prev);
		onClose();
		router.push(`/${routeName}/projets`);
	}

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="project-delete-title"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Fermeture */}
				<button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
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
					<h2 id="project-delete-title" className={styles.title}>
						Supprimer un projet
					</h2>

					<p className={styles.message}>
						Voulez-vous vraiment supprimer le projet{" "}
						<span className={styles.projectName}>{project.name}</span> ? Cette
						action est irréversible et supprimera également toutes les tâches
						associées.
					</p>
				</div>

				{error && <p className={styles.error}>{error}</p>}

				{/* Actions */}
				<div className={styles.actions}>
					<button
						className={styles.cancelBtn}
						onClick={onClose}
						disabled={isDeleting}
					>
						Annuler
					</button>
					<button
						className={styles.deleteBtn}
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Suppression..." : "Supprimer"}
					</button>
				</div>
			</div>
		</div>
	);
}
