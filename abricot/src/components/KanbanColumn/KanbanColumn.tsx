import KanbanCard from "../KanbanCard/KanbanCard";
import styles from "./KanbanColumn.module.css";

/** Données d'une tâche Kanban */
interface Task {
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

/** Props d'une colonne Kanban */
interface KanbanColumnProps {
  /** Titre de la colonne (ex: "À faire") */
  title: string;
  /** Liste des tâches de cette colonne */
  tasks: Task[];
}

/** Colonne unique du board Kanban (header + cartes) */
export default function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className={styles.column}>
      {/* En-tête : titre + compteur */}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      {/* Liste des cartes de tâches */}
      <div className={styles.cards}>
        {tasks.map((task, i) => (
          <KanbanCard key={i} {...task} />
        ))}
      </div>
    </div>
  );
}
