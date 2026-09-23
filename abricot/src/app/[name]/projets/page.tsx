"use client";

import Menu from "@/components/Menu/Menu";
import ProjectGrid from "@/components/ProjectGrid/ProjectGrid";
import Footer from "@/components/Footer/Footer";

/** Page de la liste des projets */
export default function ProjetsPage() {
	return (
		<>
			{/* Navigation : clic sur "Tableau de bord" → / */}
			<Menu />
			<ProjectGrid />
			<Footer />
		</>
	);
}
