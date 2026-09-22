import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/Provider/Provider";

/** Police Inter pour le corps de texte */
const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

/** Police Manrope pour les titres */
const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

/** Métadonnées SEO de la page d'accueil */
export const metadata: Metadata = {
	title: "Abricot - Tableau de bord",
	description: "Dashboard de gestion de projets et tâches",
};

/** Layout racine : police + langue FR */
export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
			<body>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
