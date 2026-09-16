import styles from "./ProjectTaskCard.module.css";

/** Personne assignée à la tâche */
interface Assignee {
  /** Initiales */
  initials: string;
  /** Nom complet */
  name: string;
}

/** Props d'une carte de tâche projet (vue détaillée) */
interface ProjectTaskCardProps {
  /** Nom de la tâche */
  name: string;
  /** Description */
  description: string;
  /** Statut */
  status: "À faire" | "En cours" | "Terminée";
  /** Date d'échéance */
  dueDate: string;
  /** Personnes assignées */
  assignees: Assignee[];
  /** Nombre de commentaires */
  comments: number;
}

/** Correspondance statut → classe CSS du tag */
const tagClassMap = {
  "À faire": `${styles.tag} ${styles.tagRed}`,
  "En cours": `${styles.tag} ${styles.tagOrange}`,
  "Terminée": `${styles.tag} ${styles.tagGreen}`,
};

/** Carte de tâche détaillée (échéance, assignés, commentaires) */
export default function ProjectTaskCard({
  name,
  description,
  status,
  dueDate,
  assignees,
  comments,
}: ProjectTaskCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          {/* Titre + tag statut + description */}
          <div>
            <div className={styles.titleRow}>
              <span className={styles.name}>{name}</span>
              <span className={tagClassMap[status]}>{status}</span>
            </div>
            <p className={styles.description}>{description}</p>
          </div>

          {/* Échéance */}
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Échéance :</span>
            <span className={styles.metaValue}>
              <svg className={styles.calendarIcon} viewBox="0 0 15 17" fill="none">
                <rect x="1" y="2" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 0.5v3M11 0.5v3M0.5 6.5h14" stroke="currentColor" strokeWidth="1.5" />
                <rect x="4" y="9" width="3" height="3" rx="0.5" fill="#FF8B42" />
              </svg>
              {dueDate}
            </span>
          </div>

          {/* Assignés */}
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Assigné à :</span>
            <div className={styles.assignees}>
              {assignees.map((a) => (
                <div key={a.initials} className={styles.assignee}>
                  <div className={styles.avatar}>{a.initials}</div>
                  <span className={styles.assigneeName}>{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton "voir plus" (3 points) */}
        <div className={styles.cardActions}>
          <button className={styles.moreBtn}>
            <svg className={styles.moreIcon} viewBox="0 0 16 16" fill="currentColor">
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
      <button className={styles.commentsBtn}>
        Commentaires ({comments})
        <svg className={styles.commentsChevron} viewBox="0 0 16 8" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 1l7 6 7-6" />
        </svg>
      </button>
    </div>
  );
}
