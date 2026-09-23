"use client";

import { useState, useEffect } from "react";
import Menu from "@/components/Menu/Menu";
import PageHeader from "@/components/PageHeader/PageHeader";
import TaskList from "@/components/TaskList/TaskList";
import KanbanBoard from "@/components/KanbanBoard/KanbanBoard";
import Footer from "@/components/Footer/Footer";
import TypeView from "@/components/TypeView/TypeView";
import type { Task } from "@/types/types";
import { assignedTskApi } from "@/utils/utilsUser";

interface PageProps {
	params: Promise<{ name: string }>;
}

/** Page d'accueil : Dashboard avec vue Liste/Kanban */
export default function Page({ params }: PageProps) {
	/** Vue active : liste ou kanban */
	const [activeView, setActiveView] = useState<"list" | "kanban">("list");
	const [assignedTasks, setAssignedTask] = useState<Task[]>([]);
	//savoir si les projet on été modifié pour le rendering
	const [isRerender, setIsRerender] = useState<boolean>(false);

	useEffect(() => {
		async function taskAsigned() {
			const response = await assignedTskApi();

			if (!response.success) {
				return <p>Aucune tâche trouvées </p>;
			}

			setAssignedTask(response.data.tasks);
		}
		taskAsigned();
	}, [isRerender]);

	return (
		<>
			{/* Navigation : clic sur "Projets" → /projets */}
			<Menu />
			{/* En-tête avec toggle Liste/Kanban */}
			<PageHeader setIsRerender={setIsRerender} />
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
