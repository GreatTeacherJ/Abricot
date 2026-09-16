"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import PageHeader from "@/components/PageHeader/PageHeader";
import TaskList from "@/components/TaskList/TaskList";
import KanbanBoard from "@/components/KanbanBoard/KanbanBoard";
import Footer from "@/components/Footer/Footer";
import TypeView from "@/components/TypeView/TypeView";

/** Page d'accueil : Dashboard avec vue Liste/Kanban */
export default function Home() {
	/** Router pour la navigation programmatique */
	const router = useRouter();
	/** Vue active : liste ou kanban */
	const [activeView, setActiveView] = useState<"list" | "kanban">("list");

	return (
		<>
			{/* Navigation : clic sur "Projets" → /projets */}
			<Menu
				activePage="dashboard"
				onPageChange={(page) => {
					if (page === "projets") router.push("/projets");
				}}
			/>
			{/* En-tête avec toggle Liste/Kanban */}
			<PageHeader />
			<TypeView activeView={activeView} onViewChange={setActiveView} />
			{/* Affichage conditionnel selon la vue sélectionnée */}
			{activeView === "list" ? <TaskList /> : <KanbanBoard />}
			<Footer />
		</>
	);
}
