"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project, Task } from "@/types/types";
import styles from "./DeleteModal.module.css";
import { deleteProjectApi } from "@/utils/utilsProject";
import { useProvider } from "../Provider/Provider";
import { deleteTaskApi } from "@/utils/utilsTasks";

/** Props de la modale de suppression d'un projet */
interface DeleteModalProps {
	toDelete: Project | Task;
}

/** Modale de confirmation de suppression d'un projet */
export default function DeleteModal({ toDelete }: DeleteModalProps) {
	//message d'erreur
	const [error, setError] = useState<string>("");
	//empêche le double clic pendant la suppression
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const router = useRouter();
	const params = useParams();
	const routeName = params.name as string;

	const { setRendering } = useProvider();

	let typeToDelete = "";
	//si il y a "project" c'est une tâche sinon un projet
	if ("project" in toDelete) {
		typeToDelete = "task";
	} else {
		typeToDelete = "project";
	}

	function onClose() {
		setIsOpen(false);
	}

	/** Supprime le projet puis redirige vers la liste des projets */
	async function handleDelete() {
		setIsDeleting(true);
		setError("");

		if (typeToDelete === "project") {
			const response = await deleteProjectApi(toDelete.id);

			if (!response.success) {
				setError(response.message);
				setIsDeleting(false);
				return;
			}
		} else {
			const response = await deleteTaskApi(
				(toDelete as Task).project.id,
				toDelete.id,
			);

			if (!response.success) {
				setError(response.message);
				setIsDeleting(false);
				console.log("reponse delete : ", response);
				return;
			}
			setRendering((prev) => !prev);
		}
		setIsDeleting(false);
		setIsOpen(false);
		onClose();

		if (typeToDelete === "project") {
			router.push(`/${routeName}/projets`);
		}
	}

	return (
		<>
			<button
				className={styles.editLink}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				Supprimer
			</button>
			{isOpen && (
				<div className={styles.overlay} onClick={onClose}>
					<div
						className={styles.modal}
						role="dialog"
						aria-modal="true"
						aria-labelledby="project-delete-title"
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
							<h2 id="project-delete-title" className={styles.title}>
								Supprimer un projet
							</h2>

							<p className={styles.message}>
								Voulez-vous vraiment supprimer
								{typeToDelete === "project" ? (
									<>
										le projet{" "}
										<span className={styles.projectName}>
											{(toDelete as Project).name}
										</span>{" "}
										? Cette action est irréversible et supprimera
										également toutes les tâches associées.
									</>
								) : (
									<>
										la tâche{" "}
										<span className={styles.projectName}>
											{(toDelete as Task).title}
										</span>{" "}
										? Cette action est irréversible et supprimera
										également tous les commentaires associés.
									</>
								)}
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
			)}
		</>
	);
}
