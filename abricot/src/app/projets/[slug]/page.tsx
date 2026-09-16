import ProjectPageClient from "./ProjectPageClient";

/** Données fictives des projets (clé = slug URL) */
const projectsData: Record<string, {
  name: string;
  description: string;
  tasks: {
    name: string;
    description: string;
    status: "À faire" | "En cours" | "Terminée";
    dueDate: string;
    assignees: { initials: string; name: string }[];
    comments: number;
  }[];
  contributors: {
    initials: string;
    name: string;
    isOwner?: boolean;
  }[];
}> = {
  "nom-du-projet": {
    name: "Nom du projet",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    tasks: [
      {
        name: "Authentification JWT",
        description: "Implémenter le système d'authentification avec tokens JWT",
        status: "À faire",
        dueDate: "9 mars",
        assignees: [
          { initials: "BD", name: "Bertrand Dupont" },
          { initials: "AD", name: "Anne Dupont" },
        ],
        comments: 1,
      },
      {
        name: "Authentification JWT",
        description: "Implémenter le système d'authentification avec tokens JWT",
        status: "En cours",
        dueDate: "9 mars",
        assignees: [
          { initials: "BD", name: "Bertrand Dupont" },
          { initials: "AD", name: "Anne Dupont" },
        ],
        comments: 1,
      },
      {
        name: "Authentification JWT",
        description: "Implémenter le système d'authentification avec tokens JWT",
        status: "Terminée",
        dueDate: "9 mars",
        assignees: [
          { initials: "BD", name: "Bertrand Dupont" },
          { initials: "AD", name: "Anne Dupont" },
        ],
        comments: 1,
      },
      {
        name: "Authentification JWT",
        description: "Implémenter le système d'authentification avec tokens JWT",
        status: "À faire",
        dueDate: "9 mars",
        assignees: [
          { initials: "BD", name: "Bertrand Dupont" },
          { initials: "AD", name: "Anne Dupont" },
        ],
        comments: 1,
      },
    ],
    contributors: [
      { initials: "AD", name: "Anne Dupont", isOwner: true },
      { initials: "BD", name: "Bertrand Dupont" },
      { initials: "CV", name: "Claire Vidal" },
    ],
  },
};

/** Génère les slugs pour le SSG (Static Site Generation) */
export function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

/** Page dynamique /projets/[slug] : récupère le projet par son slug */
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData[slug] ?? null;
  return <ProjectPageClient project={project} />;
}
