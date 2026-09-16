"use client";

import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import ProjectGrid from "@/components/ProjectGrid/ProjectGrid";
import Footer from "@/components/Footer/Footer";

/** Page de la liste des projets */
export default function ProjetsPage() {
  /** Router pour la navigation */
  const router = useRouter();

  return (
    <>
      {/* Navigation : clic sur "Tableau de bord" → / */}
      <Menu
        activePage="projets"
        onPageChange={(page) => {
          if (page === "dashboard") router.push("/");
        }}
      />
      <ProjectGrid />
      <Footer />
    </>
  );
}
