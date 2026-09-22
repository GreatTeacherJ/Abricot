import Menu from "@/components/Menu/Menu";
import AccountForm from "@/components/AccountForm/AccountForm";
import Footer from "@/components/Footer/Footer";

/** Page du compte utilisateur : modifier nom, prénom, email, mot de passe */
export default function ComptePage() {
	return (
		<>
			{/* Navigation avec liens Dashboard/Projets */}
			<Menu />
			<AccountForm />
			<Footer />
		</>
	);
}
