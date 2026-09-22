"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Project, User } from "@/types/types";
import styles from "./ProjectEditModal.module.css";
import { getAllProjectApi, putProjectApi } from "@/utils/utilsProject";

/** Props de la modale de modification d'un projet */
interface ProjectEditModalProps {
	project: Project;
	setIdProjectModified: Dispatch<SetStateAction<string>>;
	setPrjIsModfified: Dispatch<SetStateAction<boolean>>;
}

interface Collaborator {
	user: User;
}

type CollaboratorMap = Map<string, Collaborator>;

/** Modale de modification d'un projet (maquette Figma « Modale modifier projet ») */
export default function ProjectEditModal({
	project,
	setIdProjectModified,
	setPrjIsModfified,
}: ProjectEditModalProps) {
	/** Nom du projet */
	const [name, setName] = useState(project.name);
	/** Description du projet */
	const [description, setDescription] = useState(project.description);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedMembers, setSelectedMembers] = useState<Set<User>>(new Set());
	//Liste des collaborateur, trouver comme j'ai pu ( voir plus bas)
	const [collaboratorList, setCollaboratorList] = useState<CollaboratorMap>(new Map());
	//erreur de saisi
	const [error, setError] = useState<string>("");

	if (!project) return null;

	function onClose() {
		setIdProjectModified("");
	}

	/** Enregistre les modifications puis ferme la modale */
	async function handleSave() {
		switch (true) {
			case name.trim() === "":
				setError("Veuillez renseigner un titre valide");
				return;
			case description.trim() === "":
				setError("Veuillez renseigner une description valide");
				return;
			case description.length < 4:
				setError("La description doit contenir au moins 3 charactére");
				return;
			case name.length < 4:
				setError("Le titre doit contenir au moins 3 charactére");
				return;
			case selectedMembers.size === 0:
				setError("Veuillez séléctionner au moins un collaborateur");
				return;
		}

		// liste des collaborateurs supprimer
		// on construit un Set des ids sélectionnés pour une recherche en O(1)
		const selectedIds = new Set(Array.from(selectedMembers).map((u) => u.id));

		const removedMembers = project.members
			.filter(
				(m) => !selectedIds.has(m.user.id), // membre absent de la sélection = supprimé
			)
			.map((m) => m.user);

		const existingIds = new Set(project.members.map((m) => m.user.id));
		const addedMembers = Array.from(selectedMembers).filter(
			(u) => !existingIds.has(u.id), // présent dans la sélection mais pas dans le projet = ajouté
		);

		try {
			const response = await putProjectApi(
				project.id,
				name.trim(),
				description.trim(),
				addedMembers,
				removedMembers,
			);

			if (!response.success) {
				const errorMessage = Array.isArray(response.message)
					? response.message.join("\n")
					: response.message;
				setError(errorMessage);
				return;
			}
			setPrjIsModfified((prev) => !prev);
			onClose();
		} catch (err) {
			setError("Une erreur est survenue lors de la sauvegarde\n" + err);
			console.error(err); // pour debug
		}
	}

	function toggleAssignee(user: User) {
		setSelectedMembers((prev) => {
			const existing = Array.from(prev).find((u) => u.id === user.id);
			const next = new Set(prev);
			if (existing) {
				next.delete(existing); // il faut delete l'objet exact, pas juste l'id
			} else {
				next.add(user);
			}
			return next;
		});
	}

	useEffect(() => {
		if (!project) {
			return;
		}
		//recupérer tous les membres du projet
		const idList: Set<User> = new Set();
		project.members.map((member) => idList.add(member.user));

		setSelectedMembers(idList);

		//Recupérer la liste des collaborateur, comme on ne peut pas
		// les trouver via l'API je recupére tous les collaborateurs
		// present dans tous les projets
		async function listCollaborator() {
			const data = await getAllProjectApi();
			console.log("API : ", data.message);
			if (!data.data) {
				return;
			}
			//tous les projet de l'utilisateur
			const allProjects = data.data;

			const setCollaborator = new Map<string, Collaborator>();

			allProjects.flatMap((project) => {
				//recupérer aussi les propriétaires
				setCollaborator.set(project.owner.id, { user: project.owner });
				project.members.map((member) => {
					setCollaborator.set(member.user.id, { user: member.user });
				});
			});
			//retiré le propriétaire de la liste des collaborateurs
			setCollaborator.delete(project.owner.id);

			setCollaboratorList(setCollaborator);
			console.log("propriétaire : ", project.owner.name);
			console.log("collab : ", collaboratorList);
		}
		listCollaborator();
	}, []);

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
									required
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
									required
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
									value={
										selectedMembers.size +
										" collaborateur" +
										(selectedMembers.size > 1 ? "s" : "")
									}
									readOnly
								/>
								<svg
									className={`${styles.chevronIcon} ${isDropdownOpen ? styles.open : ""}`}
									width="16"
									height="8"
									viewBox="0 0 16 8"
									fill="none"
									stroke="currentColor"
									strokeWidth="1"
									xmlns="http://www.w3.org/2000/svg"
									onClick={() => setIsDropdownOpen((prev) => !prev)}
								>
									<path
										d="M1 1L8 7L15 1"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								{isDropdownOpen && (
									<ul className={styles.dropdownList}>
										{[...collaboratorList].map(([id, member]) => (
											<li
												key={id}
												onClick={() =>
													toggleAssignee(member.user)
												}
												className={`${styles.assigneeLi}  
													${Array.from(selectedMembers).find((u) => u.id === id) && styles.assignee}`}
											>
												{member.user.name}
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</div>
				</div>
				{error && <p className={styles.error}>{error}</p>}
				{/* Enregistrer */}
				<button className={styles.saveBtn} onClick={handleSave}>
					Enregistrer
				</button>
			</div>
		</div>
	);
}
