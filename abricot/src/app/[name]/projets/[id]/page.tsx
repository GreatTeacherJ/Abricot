import Menu from "@/components/Menu/Menu";
import ProjectDetail from "@/components/ProjectDetail/ProjectDetail";
import Footer from "@/components/Footer/Footer";

/** Composant client de la page projet (nécessaire pour le router) */
export default async function ProjectPageClient({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<>
			{/* Navigation avec liens Dashboard/Projets */}
			<Menu />
			{/* Détail du projet ou message d'erreur */}

			<ProjectDetail id={id} />

			<Footer />
		</>
	);
}
