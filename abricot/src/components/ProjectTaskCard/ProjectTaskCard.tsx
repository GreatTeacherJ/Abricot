"use client";

import { useState } from "react";
import styles from "./ProjectTaskCard.module.css";
import type { Task } from "@/types/types";
import { useParams } from "next/navigation";
import { getInitials } from "@/utils/tools";

/** Props d'une carte de tâche projet (vue détaillée) */
interface ProjectTaskCardProps {
	task: Task;
}

/** Carte de tâche détaillée (échéance, assignés, commentaires) */
export default function ProjectTaskCard({ task }: ProjectTaskCardProps) {
	//gére l'ouverture des commentaires
	const [cmtOpen, setcmtOpen] = useState<boolean>(false);
	//recupére les nouveaux commmentaires
	const [comment, setcomment] = useState<string>("");
	//on reucpere le parametre de l'url
	const params = useParams();
	//recuperation de name
	const name = params.name as string;
	//recupération des initales
	const initials = getInitials(name);

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

	async function addComment() {
		console.log("comment : ", comment);
	}

	function openComment() {
		if (cmtOpen) {
			setcmtOpen(false);
		} else {
			setcmtOpen(true);
		}
	}

	return (
		<div className={styles.card}>
			<div className={styles.cardHeader}>
				<div className={styles.cardInfo}>
					{/* Titre + tag statut + description */}
					<div>
						<div className={styles.titleRow}>
							<span className={styles.name}>{task.title}</span>
							<span
								className={`${styles.tag} ${statusStyle[task.status].className}`}
							>
								{statusStyle[task.status].label}
							</span>
						</div>
						<p className={styles.description}>{task.description}</p>
					</div>

					{/* Échéance */}
					<div className={styles.metaRow}>
						<span className={styles.metaLabel}>Échéance :</span>
						<span className={styles.metaValue}>
							<svg
								className={styles.calendarIcon}
								viewBox="0 0 15 17"
								fill="none"
							>
								<rect
									x="1"
									y="2"
									width="13"
									height="14"
									rx="2"
									stroke="currentColor"
									strokeWidth="1.5"
								/>
								<path
									d="M4 0.5v3M11 0.5v3M0.5 6.5h14"
									stroke="currentColor"
									strokeWidth="1.5"
								/>
								<rect
									x="4"
									y="9"
									width="3"
									height="3"
									rx="0.5"
									fill="#FF8B42"
								/>
							</svg>
							{formattedDate}
						</span>
					</div>

					{/* Assignés */}
					<div className={styles.metaRow}>
						<span className={styles.metaLabel}>Assigné à :</span>
						<div className={styles.assignees}>
							{task.assignees.map((a) => (
								<div key={a.id} className={styles.assignee}>
									<div
										className={`${styles.avatar} ${styles.avatarMuted}`}
									>
										{a.user.name
											.split(" ")
											.map((w) => w[0])
											.join("")}
									</div>
									<span className={styles.assigneeName}>
										{a.user.name}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Bouton "voir plus" (3 points) */}
				<div className={styles.cardActions}>
					<button className={styles.moreBtn}>
						<svg
							className={styles.moreIcon}
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<circle cx="8" cy="3" r="1.5" />
							<circle cx="8" cy="8" r="1.5" />
							<circle cx="8" cy="13" r="1.5" />
						</svg>
					</button>
				</div>
			</div>

			{/* Séparateur */}
			<hr className={styles.divider} />

			{/* Commentaires */}
			<button className={styles.commentsBtn} onClick={openComment}>
				Commentaires ({task.comments.length})
				{cmtOpen ? (
					<svg
						className={styles.commentsChevron}
						viewBox="0 0 16 8"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M1 7l7-6 7 6" />
					</svg>
				) : (
					<svg
						className={styles.commentsChevron}
						viewBox="0 0 16 8"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M1 1l7 6 7-6" />
					</svg>
				)}
			</button>
			{cmtOpen && (
				<form onSubmit={addComment}>
					<div className={styles.commentContainer}>
						{task.comments.map((comment) => (
							<div key={comment.id} className={styles.comment}>
								<span
									className={`${styles.avatar} ${styles.avatarMuted}`}
								>
									{comment.author.name
										.split(" ")
										.map((w) => w[0])
										.join("")}
								</span>
								<div className={styles.bubleComment}>
									<div className={styles.infoCommment}>
										<p className={styles.bubleCommentName}>
											{comment.author.name}
										</p>
										<span className={styles.bubleCommentDate}>
											{comment.createdAt}
										</span>
									</div>
									<p className={styles.bubleCommentContent}>
										{comment.content}
									</p>
								</div>
							</div>
						))}
						{/*A modifier imput comment user */}
						<div className={styles.comment}>
							<span className={`${styles.avatar} ${styles.avatarUser}`}>
								{initials}
							</span>

							<textarea
								name="comment"
								placeholder="Ajouter un commentaire..."
								className={styles.bubleComment}
								onChange={(e) => setcomment(e.target.value)}
							/>
						</div>
						<button
							className={`${styles.commentButton} ${comment.trim() ? styles.buttonAvtive : styles.buttonNoAvtive}`}
							disabled={!comment.trim()}
						>
							Envoyer
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
