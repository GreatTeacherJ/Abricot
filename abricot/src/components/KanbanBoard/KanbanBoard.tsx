import KanbanColumn from "../KanbanColumn/KanbanColumn";
import styles from "./KanbanBoard.module.css";

/** Données fictives des tâches groupées par statut */
const tasks = {
  "à faire": [
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "à faire" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "à faire" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "à faire" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "à faire" as const },
  ],
  "En cours": [
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "En cours" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "En cours" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "En cours" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "En cours" as const },
  ],
  "Terminée": [
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "Terminée" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "Terminée" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "Terminée" as const },
    { name: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", comments: 2, status: "Terminée" as const },
  ],
};

/** Board Kanban avec 3 colonnes : À faire, En cours, Terminées */
export default function KanbanBoard() {
  return (
    <div className={styles.board}>
      <KanbanColumn title="À faire" tasks={tasks["à faire"]} />
      <KanbanColumn title="En cours" tasks={tasks["En cours"]} />
      <KanbanColumn title="Terminées" tasks={tasks["Terminée"]} />
    </div>
  );
}
