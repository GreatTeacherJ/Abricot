"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import Image from "next/image";

/** Formulaire de connexion (email + mot de passe) */
export default function LoginForm() {
	/** Champ email */
	const [email, setEmail] = useState("");
	/** Champ mot de passe */
	const [password, setPassword] = useState("");

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
					<form
						className={styles.fields}
						onSubmit={(e) => {
							e.preventDefault();
						}}
					>
						<div className={styles.field}>
							<label className={styles.label} htmlFor="email">
								Email
							</label>
							<input
								className={styles.input}
								id="email"
								type="email"
								placeholder="Votre email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
								placeholder="Votre mot de passe"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

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
					<Link href="#" className={styles.signupLink}>
						Créer un compte
					</Link>
				</div>
			</div>

			{/* Panneau droit : illustration (dégradé placeholder) */}
			<div className={styles.hero} />
		</div>
	);
}
