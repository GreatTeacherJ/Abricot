import styles from "./PageHeader.module.css";

/** En-tête du dashboard : titre, chips de vue, bouton création */
export default function PageHeader() {
	return (
		<div className={styles.header}>
			{/* Titre et sous-titre */}
			<div className={styles.titleBlock}>
				<h1 className={styles.title}>Tableau de bord</h1>
				<p className={styles.subtitle}>
					Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
				</p>
			</div>
			<button className={styles.createBtn}>+ Créer un projet</button>
		</div>
	);
}
