import styles from "./TaskRow.module.css";

/** Props d'une ligne de tâche (vue tableau) */
interface TaskRowProps {
  /** Nom de la tâche */
  name: string;
  /** Description courte */
  description: string;
  /** Nom du projet associé */
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

/** Ligne de tâche unique dans la vue tableau */
export default function TaskRow({
  name,
  description,
  project,
  date,
  comments,
  status,
}: TaskRowProps) {
  return (
    <div className={styles.row}>
      {/* Infos principales : nom, description, métadonnées */}
      <div className={styles.info}>
        <div className={styles.nameBlock}>
          <span className={styles.name}>{name}</span>
          <span className={styles.description}>{description}</span>
        </div>
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
      </div>

      {/* Actions : tag statut + bouton voir */}
      <div className={styles.actions}>
        <span className={tagClassMap[status]}>{status}</span>
        <button className={styles.viewBtn}>Voir</button>
      </div>
    </div>
  );
}
