import styles from "./Contributors.module.css";
import type { Project } from "@/types/types";

/** Props de la barre des contributeurs */
interface ContributorsProps {
	/** Liste des contributeurs du projet */
	project: Project;
}

/** Barre affichant les contributeurs du projet avec leurs rôles */
export default function Contributors({ project }: ContributorsProps) {
	const owner = {
		initials: project.owner.name
			.split(" ")
			.map((w) => w[0])
			.join(""),
		name: project.owner.name,
	};

	const contributors = project.members.map((member) => ({
		initials: member.user.name
			.split(" ")
			.map((w) => w[0])
			.join(""),
		name: member.user.name,
	}));

	return (
		<div className={styles.bar}>
			{/* En-tête : titre + compteur */}
			<div className={styles.header}>
				<h3 className={styles.title}>Contributeurs</h3>
				<span className={styles.count}>{contributors.length} personnes</span>
			</div>
			{/* Liste des membres avec avatars et rôles */}
			<div className={styles.members}>
				{/* Avatar (orange) */}
				<div className={`${styles.avatar} ${styles.avatarOwner}`}>
					{owner.initials}
				</div>
				{/* Tag rôle (Propriétaire ou nom complet) */}
				<span className={`${styles.roleTag} ${styles.roleOwner}`}>
					Propriétaire
				</span>

				{contributors.map((c) => (
					<div key={c.initials} className={styles.member}>
						{/* Avatar (gris) */}
						<div className={`${styles.avatar} ${styles.avatarMember}`}>
							{c.initials}
						</div>
						{/* Tag rôle (Propriétaire ou nom complet) */}
						<span className={`${styles.roleTag} ${styles.roleMember}`}>
							{c.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
