"use client";

import { use, useState, useEffect } from "react";
import Menu from "@/components/Menu/Menu";
import PageHeader from "@/components/PageHeader/PageHeader";
import TaskList from "@/components/TaskList/TaskList";
import KanbanBoard from "@/components/KanbanBoard/KanbanBoard";
import Footer from "@/components/Footer/Footer";
import TypeView from "@/components/TypeView/TypeView";
import type { Tasks } from "@/types/types";
import { assignedTskApi } from "@/utils/utilsUser";

interface PageProps {
	params: Promise<{ name: string }>;
}

/** Page d'accueil : Dashboard avec vue Liste/Kanban */
export default function Page({ params }: PageProps) {
	const { name } = use(params);

	/** Vue active : liste ou kanban */
	const [activeView, setActiveView] = useState<"list" | "kanban">("list");
	const [assignedTasks, setAssignedTask] = useState<Tasks>([]);

	useEffect(() => {
		async function taskAsigned() {
			const data = await assignedTskApi();

			if (!data.data) {
				return <p>Aucune tâche trouvées </p>;
			}

			setAssignedTask(data.data);
		}
		taskAsigned();
	}, []);

	return (
		<>
			{/* Navigation : clic sur "Projets" → /projets */}
			<Menu />
			{/* En-tête avec toggle Liste/Kanban */}
			<PageHeader />
			<TypeView activeView={activeView} onViewChange={setActiveView} />
			{/* Affichage conditionnel selon la vue sélectionnée */}
			{activeView === "list" ? (
				<TaskList assignedTasks={assignedTasks} />
			) : (
				<KanbanBoard assignedTasks={assignedTasks} />
			)}
			<Footer />
		</>
	);
}
