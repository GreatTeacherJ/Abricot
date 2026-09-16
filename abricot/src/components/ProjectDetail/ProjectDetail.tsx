import Link from "next/link";
import ProjectTaskCard from "../ProjectTaskCard/ProjectTaskCard";
import Contributors from "../Contributors/Contributors";
import styles from "./ProjectDetail.module.css";

/** Données d'une tâche projet */
interface Task {
  /** Nom de la tâche */
  name: string;
  /** Description */
  description: string;
  /** Statut */
  status: "À faire" | "En cours" | "Terminée";
  /** Date d'échéance */
  dueDate: string;
  /** Personnes assignées */
  assignees: { initials: string; name: string }[];
  /** Nombre de commentaires */
  comments: number;
}

/** Données d'un contributeur */
interface Contributor {
  /** Initiales */
  initials: string;
  /** Nom complet */
  name: string;
  /** true si propriétaire */
  isOwner?: boolean;
}

/** Props de la page de détail d'un projet */
interface ProjectDetailProps {
  /** Nom du projet */
  name: string;
  /** Description du projet */
  description: string;
  /** Liste des tâches */
  tasks: Task[];
  /** Liste des contributeurs */
  contributors: Contributor[];
}

/** Page de détail d'un projet : tâches, contributeurs, actions */
export default function ProjectDetail({
  name,
  description,
  tasks,
  contributors,
}: ProjectDetailProps) {
  return (
    <div className={styles.page}>
      {/* En-tête : bouton retour + titre + lien modifier */}
      <div className={styles.projectHeader}>
        <Link href="/projets" className={styles.backBtn}>
          <svg className={styles.backIcon} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 1L3 7.5L10 14" />
          </svg>
        </Link>
        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{name}</h1>
            <span className={styles.editLink}>Modifier</span>
          </div>
          <p className={styles.projectDesc}>{description}</p>
        </div>
      </div>

      {/* Carte principale : onglets + filtres + liste de tâches */}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          <div className={styles.contentTitle}>
            <h2 className={styles.sectionTitle}>Tâches</h2>
            <span className={styles.sectionSubtitle}>Par ordre de priorité</span>
          </div>
          <div className={styles.controls}>
            {/* Onglets Liste/Calendrier */}
            <div className={styles.chips}>
              <button className={`${styles.chip} ${styles.chipActive}`}>Liste</button>
              <button className={`${styles.chip} ${styles.chipInactive}`}>Calendrier</button>
            </div>
            {/* Filtre par statut */}
            <button className={styles.filterBtn}>
              Statut
              <svg className={styles.filterChevron} viewBox="0 0 16 8" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l7 6 7-6" />
              </svg>
            </button>
            {/* Barre de recherche */}
            <div className={styles.search}>
              <svg className={styles.searchIcon} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="6" r="5" />
                <path d="M10 10l3 3" />
              </svg>
              <input className={styles.searchInput} type="text" placeholder="Rechercher une tâche" />
            </div>
          </div>
        </div>

        {/* Liste des tâches du projet */}
        <div className={styles.taskList}>
          {tasks.map((task, i) => (
            <ProjectTaskCard key={i} {...task} />
          ))}
        </div>
      </div>

      {/* Barre des contributeurs */}
      <Contributors contributors={contributors} />

      {/* Boutons d'action : créer tâche + IA */}
      <div className={styles.actionButtons}>
        <button className={styles.createBtn}>Créer une tâche</button>
        <button className={styles.aiBtn}>
          <svg className={styles.aiStar} viewBox="0 0 21 21" fill="currentColor">
            <path d="M10.5 0l2.4 7.4h7.6l-6.1 4.5 2.4 7.4L10.5 14.8l-6.2 4.5 2.4-7.4L.6 7.4h7.6z" />
          </svg>
          IA
        </button>
      </div>
    </div>
  );
}
