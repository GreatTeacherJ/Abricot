import Link from "next/link";
import styles from "./ProjectCard.module.css";

/** Membre de l'équipe projet */
interface TeamMember {
  /** Initiales affichées sur l'avatar */
  initials: string;
  /** true si propriétaire du projet */
  isOwner?: boolean;
}

/** Props d'une carte projet */
interface ProjectCardProps {
  /** Nom du projet */
  name: string;
  /** Slug URL pour la navigation */
  slug: string;
  /** Description du projet */
  description: string;
  /** Pourcentage de progression (0-100) */
  progress: number;
  /** Nombre total de tâches */
  totalTasks: number;
  /** Nombre de tâches terminées */
  completedTasks: number;
  /** Membres de l'équipe */
  team: TeamMember[];
}

/** Carte projet cliquable menant à la page de détail */
export default function ProjectCard({
  name,
  slug,
  description,
  progress,
  totalTasks,
  completedTasks,
  team,
}: ProjectCardProps) {
  return (
    <Link href={`/projets/${slug}`} className={styles.card}>
      {/* Titre + description */}
      <div className={styles.titleBlock}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {/* Barre de progression */}
      <div className={styles.progressBlock}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progression</span>
          <span className={styles.progressValue}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.taskCount}>
          {completedTasks}/{totalTasks} tâches terminées
        </span>
      </div>

      {/* Équipe : avatars + tag propriétaire */}
      <div className={styles.teamBlock}>
        <span className={styles.teamLabel}>
          <svg className={styles.teamLabelIcon} viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1c-2.7 0-5 1.3-5 3v1h10v-1c0-1.7-2.3-3-5-3z" />
          </svg>
          Équipe ({team.length})
        </span>
        <div className={styles.teamMembers}>
          {/* Premier membre (propriétaire) */}
          {team.slice(0, 1).map((member) => (
            <div key={member.initials} className={styles.avatar}>
              {member.initials}
            </div>
          ))}
          {team.slice(0, 1).map((member) =>
            member.isOwner ? (
              <span key={`owner-${member.initials}`} className={styles.ownerTag}>
                Propriétaire
              </span>
            ) : null
          )}
          {/* Membres supplémentaires (avatars superposés) */}
          {team.slice(1).map((member) => (
            <div
              key={member.initials}
              className={`${styles.avatar} ${styles.avatarOverlap}`}
            >
              {member.initials}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
