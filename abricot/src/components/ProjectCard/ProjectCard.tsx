"use client";

import Link from "next/link";
import styles from "./ProjectCard.module.css";
import type { Project, Tasks } from "@/types/types";
import Image from "next/image";
import { taskForProjectApi } from "@/utils/utilsUser";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/** Props d'une carte projet */
interface ProjectCardProps {
	project: Project;
}

/** Carte projet cliquable menant à la page de détail */
export default function ProjectCard({ project }: ProjectCardProps) {
	//liste de tache récupérées
	const [tasks, setTasks] = useState<Tasks>([]);
	const params = useParams();
	const routeName = params.name as string;

	const totalTasks = project._count.tasks;
	//Recherche des tache términées
	const completedTasks = tasks.filter((task) => task.status === "DONE").length;
	const progress = Math.round((completedTasks / totalTasks) * 100);

	useEffect(() => {
		async function taskForProject() {
			const data = await taskForProjectApi(project.id);

			if (!data.data) {
				return;
			}
			setTasks(data.data);
		}

		taskForProject();
	}, []);

	return (
		<Link href={`/${routeName}/projets/${project.id}`} className={styles.card}>
			{/* Titre + description */}
			<div className={styles.titleBlock}>
				<h3 className={styles.title}>{project.name}</h3>
				<p className={styles.description}>{project.description}</p>
			</div>

			{/* Barre de progression */}
			<div className={styles.progressBlock}>
				<div className={styles.progressHeader}>
					<span className={styles.progressLabel}>Progression</span>
					<span className={styles.progressValue}>{progress}%</span>
				</div>
				<div className={styles.progressBar}>
					<div
						className={styles.progressFill}
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className={styles.taskCount}>
					{completedTasks}/{totalTasks} tâches terminées
				</span>
			</div>

			{/* Équipe : avatars + tag propriétaire */}
			<div className={styles.teamBlock}>
				<span className={styles.teamLabel}>
					<Image src="theamIcon.svg" alt="" width={11} height={11} />
					Équipe ({project.members.length + 1})
				</span>
				<div className={styles.teamMembers}>
					{/* Premier membre (propriétaire) */}
					<div className={`${styles.avatar} ${styles.ownerAvatar}`}>
						{project.owner.name
							.split(" ")
							.map((w) => w[0])
							.join("")}
					</div>

					<span className={styles.ownerTag}>Propriétaire</span>
					<div className={styles.containerAvatar}>
						{/* Membres supplémentaires (avatars superposés) */}
						{project.members.map((member) => (
							<div
								key={member.id}
								className={`${styles.avatar} ${styles.avatarOverlap} ${styles.otherAvatar}`}
							>
								{member.user.name
									.split(" ")
									.map((w) => w[0])
									.join("")}
							</div>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
}
