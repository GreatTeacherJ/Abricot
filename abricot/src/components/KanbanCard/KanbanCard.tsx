import styles from "./KanbanCard.module.css";

/** Props d'une carte Kanban */
interface KanbanCardProps {
  /** Nom de la tâche */
  name: string;
  /** Description courte */
  description: string;
  /** Projet associé */
  project: string;
  /** Date d'échéance */
  date: string;
  /** Nombre de commentaires */
  comments: number;
  /** Statut de la tâche */
  status: "à faire" | "En cours" | "Terminée";
}

/** Correspondance statut → classe CSS du tag */
const tagClassMap = {
  "à faire": `${styles.tag} ${styles.tagRed}`,
  "En cours": `${styles.tag} ${styles.tagOrange}`,
  "Terminée": `${styles.tag} ${styles.tagGreen}`,
};

/** Carte de tâche unique dans une colonne Kanban */
export default function KanbanCard({
  name,
  description,
  project,
  date,
  comments,
  status,
}: KanbanCardProps) {
  return (
    <div className={styles.card}>
      {/* En-tête : nom + tag statut */}
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={tagClassMap[status]}>{status}</span>
      </div>
      <span className={styles.description}>{description}</span>
      {/* Pied de page : métadonnées + bouton voir */}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <svg className={styles.metaIcon} viewBox="0 0 14 14" fill="currentColor">
              <path d="M2 2h10v10H2z" />
            </svg>
            {project}
          </span>
          <span className={styles.metaItem}>
            <svg className={styles.metaIcon} viewBox="0 0 14 14" fill="currentColor">
              <rect x="1" y="2" width="12" height="11" rx="1" />
              <path d="M4 0v3M10 0v3M1 5h12" />
            </svg>
            {date}
          </span>
          <span className={styles.metaItem}>
            <svg className={styles.metaIcon} viewBox="0 0 14 14" fill="currentColor">
              <path d="M1 1h12v9H4l-3 3V1z" />
            </svg>
            {comments}
          </span>
        </div>
        <button className={styles.viewBtn}>Voir</button>
      </div>
    </div>
  );
}
