"use client";

import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import ProjectDetail from "@/components/ProjectDetail/ProjectDetail";
import Footer from "@/components/Footer/Footer";

/** Props du composant client de la page projet */
interface ProjectPageClientProps {
  /** Données du projet (null si non trouvé) */
  project: {
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
  } | null;
}

/** Composant client de la page projet (nécessaire pour le router) */
export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  /** Router pour la navigation */
  const router = useRouter();

  return (
    <>
      {/* Navigation avec liens Dashboard/Projets */}
      <Menu
        activePage="projets"
        onPageChange={(page) => {
          if (page === "dashboard") router.push("/");
          else router.push("/projets");
        }}
      />
      {/* Détail du projet ou message d'erreur */}
      {project ? (
        <ProjectDetail {...project} />
      ) : (
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h1>Projet non trouvé</h1>
        </div>
      )}
      <Footer />
    </>
  );
}
