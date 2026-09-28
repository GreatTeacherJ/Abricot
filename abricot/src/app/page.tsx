import { redirect } from "next/navigation";
import { profilApi } from "@/utils/utilsUser";

/** Page racine : redirige vers le dashboard de l'utilisateur (ou la connexion) */
export default async function RootPage() {
	const data = await profilApi();

	if (!data.success || !data.data?.user) {
		redirect("/connexion");
	}
	const name = data.data.user.name;
	const RouteName = name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // enlève les accents
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");

	redirect(`/${RouteName}`);
}
