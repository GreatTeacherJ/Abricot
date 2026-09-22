"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Task, Project } from "@/types/types";
import styles from "@/components/TaskEditModal/TaskEditModal.module.css";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProjectApi } from "@/utils/utilsProject";
import { putTasksApi } from "@/utils/utilsTasks";

/** Statuts disponibles avec leur libellé et leur style de tag */
const STATUSES: { value: Task["status"]; label: string; className: string }[] = [
	{ value: "TODO", label: "À faire", className: styles.tagRed },
	{ value: "IN_PROGRESS", label: "En cours", className: styles.tagOrange },
	{ value: "DONE", label: "Terminée", className: styles.tagGreen },
];

/** Props de la modale de modification d'une tâche */
interface TaskEditModalProps {
	task: Task;
	setidTaskModified: Dispatch<SetStateAction<string>>;
	setPrjIsModfified: Dispatch<SetStateAction<boolean>>;
}

/** Modale de modification d'une tâche (maquette Figma « Modale modifier une tâche ») */
export default function TaskEditModal({
	task,
	setidTaskModified,
	setPrjIsModfified,
}: TaskEditModalProps) {
	/** Titre de la tâche */
	const [title, setTitle] = useState(task.title);
	/** Description de la tâche */
	const [description, setDescription] = useState(task.description);
	/** Échéance — stockée en Date en interne, convertie en string uniquement à l'envoi */
	const [dueDate, setDueDate] = useState<Date>(
		task.dueDate ? new Date(task.dueDate) : new Date(),
	);
	/** Contrôle l'ouverture du calendrier flottant */
	const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
	/** Statut sélectionné */
	const [status, setStatus] = useState<Task["status"]>(task.status);
	//Projet stocké
	const [currentProject, setProject] = useState<Project | null>(null);
	//Partie pour l'imput assigné les tâche
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
	//reponse de l'API
	const [error, seterror] = useState<string>("");

	useEffect(() => {
		async function apiProject() {
			const data = await getProjectApi(task.project.id);
			if (!data.data) {
				return;
			}
			setProject(data.data);
		}

		apiProject();
	}, []);

	function onClose() {
		setidTaskModified("");
	}

	/** Enregistre les modifications puis ferme la modale */
	async function handleSave() {
		const date = new Date(dueDate).toISOString(); // "2026-09-18T00:00:00.000Z"

		console.log("appui sur envoyer");

		const response = await putTasksApi(
			task.project.id,
			task.id,
			title,
			description,
			status,
			"MEDIUM",
			date,
			selectedAssignees,
		);

		if (!response.data) {
			seterror(response.message);
			return;
		}

		setPrjIsModfified((prev) => !prev);
		onClose();
	}

	function toggleAssignee(userId: string) {
		setSelectedAssignees((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	}

	useEffect(() => {
		if (!currentProject) {
			return;
		}

		const assigneesList = currentProject?.members.filter((member) =>
			assignedVerif(member.user.id),
		);

		const idList = assigneesList.map((member) => member.user.id);

		if (assignedVerif(currentProject.owner.id)) {
			idList.push(currentProject.owner.id);
		}

		setSelectedAssignees(idList);
	}, [currentProject]);

	function assignedVerif(id: string): boolean {
		const bool = task.assignees.some((assignee) => assignee.user.id === id);

		return bool;
	}

	/** Formate une Date en "YYYY-MM-DD" en utilisant l'heure LOCALE (pas UTC, contrairement à toISOString) */
	function toLocalDateString(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modalWrapper}
				role="dialog"
				aria-modal="true"
				aria-labelledby="task-edit-title"
				onClick={(e) => e.stopPropagation()}
			>
				<form className={styles.modal}>
					{/* Fermeture */}
					<button
						className={styles.closeBtn}
						onClick={onClose}
						aria-label="Fermer"
						type="button"
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
										name="title"
										required
										onChange={(e) => setTitle(e.target.value)}
									/>
								</div>
							</div>

							{/* Description */}
							<div className={styles.field}>
								<label
									className={styles.label}
									htmlFor="task-description"
								>
									Description
								</label>
								<div className={styles.control}>
									<input
										id="task-description"
										className={styles.controlInput}
										type="text"
										value={description}
										name="description"
										required
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>
							</div>

							{/* Échéance */}
							<div
								className={styles.field}
								style={{ position: "relative" }}
							>
								<label className={styles.label} htmlFor="task-due-date">
									Échéance
								</label>
								<div className={styles.control}>
									<input
										id="task-due-date"
										className={styles.controlInput}
										type="date"
										name="date"
										// Date → "YYYY-MM-DD" pour l'affichage natif de l'input
										required
										value={toLocalDateString(dueDate)}
										onChange={(e) => {
											// parse "YYYY-MM-DD" en LOCAL (pas new Date(string) qui interprète en UTC)
											const [year, month, day] = e.target.value
												.split("-")
												.map(Number);
											setDueDate(new Date(year, month - 1, day));
										}}
									/>
									<button
										type="button"
										onClick={() => setCalendarOpen((open) => !open)}
									>
										<Image
											src="/grayCalandar.svg"
											alt=""
											width={16}
											height={16}
										/>
									</button>
									{calendarOpen && (
										<div className={styles.calendarPopup}>
											<DatePicker
												selected={dueDate} // déjà une Date, pas de conversion nécessaire
												onChange={(date: Date | null) => {
													date && setDueDate(date);
													setCalendarOpen(false); // ferme le calendrier après sélection
												}}
												inline // affiche le calendrier directement, pas dans un input
												onClickOutside={() =>
													setCalendarOpen(false)
												}
											/>
										</div>
									)}
								</div>
							</div>

							{/* Assignés */}
							<div className={styles.field}>
								<label className={styles.label} htmlFor="project-members">
									Assigné à :
								</label>
								<div className={styles.control}>
									<input
										id="project-members"
										className={styles.controlInput}
										type="text"
										value={
											selectedAssignees.length +
											" collaborateur" +
											(selectedAssignees.length > 1 ? "s" : "")
										}
										readOnly
									/>
									<svg
										className={`${styles.chevronIcon} ${isDropdownOpen ? styles.open : ""}`}
										width="17"
										height="10"
										viewBox="0 0 17 10"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										onClick={() => setIsDropdownOpen((prev) => !prev)}
									>
										<path
											d="M16.3535 0.353546L8.35352 8.35355L0.353515 0.353546"
											stroke="#0F0F0F"
										/>
									</svg>

									{isDropdownOpen && (
										<ul className={styles.dropdownList}>
											{currentProject && (
												<li
													onClick={() =>
														toggleAssignee(
															currentProject.owner.id,
														)
													}
													className={`${styles.assigneeLi}  
													${selectedAssignees.includes(currentProject.owner.id) && styles.assignee}`}
												>
													{currentProject.owner.name}
												</li>
											)}
											{currentProject?.members.map((member) => (
												<li
													key={member.id}
													onClick={() =>
														toggleAssignee(member.user.id)
													}
													className={`${styles.assigneeLi}  
													${selectedAssignees.includes(member.user.id) && styles.assignee}`}
												>
													{member.user.name}
												</li>
											))}
										</ul>
									)}
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
										className={`${styles.tag} ${status === s.value ? s.className : styles.tagUnselected}`}
										onClick={() => setStatus(s.value)}
										aria-pressed={status === s.value}
									>
										{s.label}
									</button>
								))}
							</div>
						</div>
					</div>
					{error && <p>{error}</p>}
					{/* Enregistrer */}
					<button className={styles.saveBtn} onClick={handleSave} type="button">
						Enregistrer
					</button>
				</form>
			</div>
		</div>
	);
}
