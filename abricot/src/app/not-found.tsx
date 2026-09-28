import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
	return (
		<div className={styles.container}>
			{/* Overlay sombre pour la lisibilité du texte */}
			<div className={styles.overlay} />

			<div className={styles.content}>
				{/* Logo */}
				<Image
					src="/iconBlack.svg"
					alt="Logo"
					width={360}
					height={48}
					priority
					className={styles.logo}
				/>

				<h1 className={styles.title}>404</h1>
				<p className={styles.subtitle}>Page introuvable</p>

				<Link href="/" className={styles.button}>
					Retour à l'accueil
				</Link>
			</div>
		</div>
	);
}
