import LoginForm from "@/components/LoginForm/LoginForm";
import SignIn from "@/components/SignIn/SignIn";

/** Métadonnées SEO de la page de connexion */
export const metadata = {
	title: "Abricot - Connexion",
	description: "Connectez-vous à votre compte Abricot",
};

/** Page de connexion : rend le composant LoginForm */
export default function ConnexionPage() {
	return <LoginForm />;
}
