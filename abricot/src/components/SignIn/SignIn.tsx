"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SignIn.module.css";
import Image from "next/image";
import { registerAPI } from "@/utils/utilsLog";
import { useState } from "react";

/** Formulaire de connexion (email + mot de passe) */
export default function LoginForm() {
	/**rediriger la page */
	const rooter = useRouter();
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const firstName = formData.get("firstName") as string;
		const lastName = formData.get("lastName") as string;

		const name = firstName + " " + lastName;

		const response = await registerAPI(email, password, name);

		if (!response) {
			setErrorMessage("Erreur serveur");
			return;
		}

		if (response.data?.success) {
			const name = response.data.data.user.name;
			const initials = name
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "") // enlève les accents
				.replace(/\s+/g, "-")
				.replace(/[^a-z0-9-]/g, "");
			rooter.push(`/${initials}`);
		}
		setErrorMessage(response.message);
	}

	return (
		<div className={styles.page}>
			{/* Panneau gauche : formulaire */}
			<div className={styles.panel}>
				<div className={styles.logo}>
					<Image src="icon.svg" alt="" width={252} height={32} />
				</div>

				<div className={styles.formContent}>
					<h1 className={styles.title}>Inscription</h1>

					{/* Formulaire email/mot de passe */}
					<form className={styles.fields} onSubmit={handleSubmit}>
						<div className={styles.field}>
							<label className={styles.label} htmlFor="Nom">
								Nom
							</label>
							<input
								className={styles.input}
								id="firstName"
								type="firstName"
								name="firstName"
								placeholder="Votre Nom"
							/>
						</div>
						<div className={styles.field}>
							<label className={styles.label} htmlFor="Prénom">
								Prénom
							</label>
							<input
								className={styles.input}
								id="lastName"
								type="lastName"
								name="lastName"
								placeholder="Votre Prénom"
							/>
						</div>
						<div className={styles.field}>
							<label className={styles.label} htmlFor="email">
								Email
							</label>
							<input
								className={styles.input}
								id="email"
								type="email"
								name="email"
								placeholder="Votre email"
							/>
						</div>

						<div className={styles.field}>
							<label className={styles.label} htmlFor="password">
								Mot de passe
							</label>
							<input
								className={styles.input}
								id="password"
								type="password"
								name="password"
								placeholder="Votre mot de passe"
							/>
						</div>
						{/*Le message apparait en cas d'érreur reçu par la fonction */}
						{errorMessage && <p className={styles.error}>{errorMessage}</p>}

						<button type="submit" className={styles.submitBtn}>
							S’inscrire
						</button>
					</form>
				</div>

				{/* Lien d'inscription */}
				<div className={styles.signupRow}>
					<span className={styles.signupText}>Déjà inscrit ?</span>
					<Link href="/connexion" className={styles.signupLink}>
						Se connecter
					</Link>
				</div>
			</div>

			{/* Panneau droit : illustration (dégradé placeholder) */}
			<div className={styles.hero} />
		</div>
	);
}
