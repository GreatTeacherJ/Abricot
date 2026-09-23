"use client";

import { useEffect, useState } from "react";
import styles from "./AccountForm.module.css";
import { useProvider } from "../Provider/Provider";
import { putProfilApi } from "@/utils/utilsUser";

/** Formulaire de modification du compte utilisateur */
export default function AccountForm() {
	//recupération des info de l'utilisateur par le Provider
	const { currentUser, setRendering } = useProvider();
	/** Nom de famille */
	const [firstName, setFirstName] = useState("");
	/** Prénom */
	const [lastName, setLastName] = useState("");
	/** Adresse email */
	const [email, setEmail] = useState("");
	/** Nouveau mot de passe (vide par défaut) */
	const [newPassword, setNewPassword] = useState("");
	/** Nouveau mot de passe (vide par défaut) */
	const [oldPassword, setOldPassword] = useState("");
	//Message d'érreur
	const [error, setError] = useState("");
	//doit être à true pour valider le formulaire
	const [isModified, setIsModified] = useState<boolean>(false);

	useEffect(() => {
		if (!currentUser) {
			return;
		} // trim() enlève les espaces en début/fin, indexOf trouve le premier espace
		const trimmed = currentUser.name.trim();
		const spaceIndex = trimmed.indexOf(" ");

		if (spaceIndex === -1) {
			setFirstName(trimmed);
			setLastName("");
		} else {
			setFirstName(trimmed.slice(0, spaceIndex));

			setLastName(trimmed.slice(spaceIndex + 1));
		}

		setEmail(currentUser.email);
	}, [currentUser]);

	async function handleChange(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();

		switch (true) {
			case firstName.trim().length < 3:
				setError("Merci de rensigner ai moins 2 lettre pour le nom");
				return;
			case lastName.trim().length < 3:
				setError("Merci de rensigner ai moins 2 lettre pour le prénom");
				return;
			case newPassword.length > 0 && newPassword.length < 9:
				setError("Votre Mot de passe doit contenir au moins 8 charatére");
				return;
			case newPassword.length > 0 && oldPassword.length === 0:
				setError("Merci d'entrer votre ancien mot de passe");
				return;
		}

		const name = firstName + " " + lastName;
		const response = await putProfilApi(name, email, newPassword, oldPassword);

		// on filtre les réponses en échec et on récupère leurs messages
		const errorList = response
			.filter((res) => !res.success)
			.map((res) => res.message);

		const errorMessage = errorList.join("\n");

		setNewPassword("");
		setOldPassword("");
		setError(errorMessage);
		setRendering((prev) => !prev);
		setIsModified(false);
	}

	return (
		<div className={styles.card}>
			{/* En-tête : titre + firstName complet */}
			<div className={styles.header}>
				<h1 className={styles.title}>Mon compte</h1>
				<p className={styles.subtitle}>{currentUser?.name}</p>
			</div>

			{/* Formulaire de modification */}
			<form className={styles.form} onSubmit={handleChange}>
				<div className={styles.field}>
					<label className={styles.label} htmlFor="firstName">
						Nom
					</label>
					<input
						className={styles.input}
						id="firstName"
						type="text"
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value);
							setIsModified(true);
						}}
						required
					/>
				</div>

				<div className={styles.field}>
					<label className={styles.label} htmlFor="lastName">
						Prénom
					</label>
					<input
						className={styles.input}
						id="lastName"
						type="text"
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value);
							setIsModified(true);
						}}
						required
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
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setIsModified(true);
						}}
						required
					/>
				</div>

				<div className={styles.field}>
					<label className={styles.label} htmlFor="newPassword">
						Changer le mot de passe
					</label>
					<input
						className={styles.input}
						id="newPassword"
						type="Password"
						placeholder="•••••••••••"
						value={newPassword}
						onChange={(e) => {
							setNewPassword(e.target.value);
							setIsModified(true);
						}}
					/>
				</div>
				{newPassword && (
					<div className={styles.field}>
						<label className={styles.label} htmlFor="oldPassword">
							Ancien mot de passse
						</label>
						<input
							className={styles.input}
							id="oldPassword"
							type="Password"
							placeholder="•••••••••••"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							required
						/>
					</div>
				)}
				{error && <p className={styles.error}>{error}</p>}
				<button
					type="submit"
					className={
						styles.submitBtn +
						" " +
						(isModified ? styles.activate : styles.noActivate)
					}
					disabled={!isModified}
				>
					Modifier les informations
				</button>
			</form>
		</div>
	);
}
