"use client";

import Link from "next/link";
import styles from "./LoginForm.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/utils/utilsLog";
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
		console.log({ email, password });
		console.log(email);
		console.log(password);

		//const response = await loginAPI(email, password);

		//Pour teste a supprimer
		const response = await loginAPI("alice@example.com", "P@ssword123");

		if (!response) {
			setErrorMessage("Erreur serveur");
			return;
		}

		if (response === "connected") {
			setErrorMessage(response);
			rooter.push("/");
		} else {
			setErrorMessage(response);
		}
	}

	return (
		<div className={styles.page}>
			{/* Panneau gauche : formulaire */}
			<div className={styles.panel}>
				<div className={styles.logo}>
					<Image src="icon.svg" alt="" width={252} height={32} />
				</div>

				<div className={styles.formContent}>
					<h1 className={styles.title}>Connexion</h1>

					{/* Formulaire email/mot de passe */}
					<form className={styles.fields} onSubmit={handleSubmit}>
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
							Se connecter
						</button>
					</form>

					<Link href="#" className={styles.forgotLink}>
						Mot de passe oublié ?
					</Link>
				</div>

				{/* Lien d'inscription */}
				<div className={styles.signupRow}>
					<span className={styles.signupText}>Pas encore de compte ?</span>
					<Link href="/inscription" className={styles.signupLink}>
						Créer un compte
					</Link>
				</div>
			</div>

			{/* Panneau droit : illustration (dégradé placeholder) */}
			<div className={styles.hero} />
		</div>
	);
}
