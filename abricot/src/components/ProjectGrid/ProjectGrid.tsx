import ProjectCard from "../ProjectCard/ProjectCard";
import styles from "./ProjectGrid.module.css";

/** Données fictives des projets (à remplacer par une API) */
const projects = [
  {
    name: "Nom du projet",
    slug: "nom-du-projet",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-2",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-3",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-4",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-5",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-6",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-7",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-8",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
  {
    name: "Nom du projet",
    slug: "nom-du-projet-9",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    progress: 0,
    totalTasks: 2,
    completedTasks: 0,
    team: [
      { initials: "AD", isOwner: true },
      { initials: "BD" },
      { initials: "CV" },
    ],
  },
];

/** Grille de projets (3 colonnes responsive) */
export default function ProjectGrid() {
  return (
    <div className={styles.page}>
      {/* En-tête : titre + bouton création */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Mes projets</h1>
          <p className={styles.subtitle}>Gérez vos projets</p>
        </div>
        <button className={styles.createBtn}>+ Créer un projet</button>
      </div>
      {/* Grille de cartes projet */}
      <div className={styles.grid}>
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}
