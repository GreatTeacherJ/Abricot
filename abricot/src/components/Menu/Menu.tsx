import styles from "./Menu.module.css";
import Image from "next/image";

/** Props de la barre de navigation */
interface MenuProps {
	/** Page actuellement affichée */
	activePage: "dashboard" | "projets";
	/** Callback de navigation entre pages */
	onPageChange: (page: "dashboard" | "projets") => void;
}

/** Barre de navigation supérieure (logo, liens, avatar) */
export default function Menu({ activePage, onPageChange }: MenuProps) {
	return (
		<nav className={styles.nav}>
			{/* Logo de l'application */}
			<div className={styles.logo}>
				<Image src="icon.svg" alt="icon abricot" height={18.72} width={147} />
			</div>

			{/* Liens de navigation */}
			<div className={styles.navItems}>
				<button
					className={`${styles.navItem} ${activePage === "dashboard" ? styles.navItemActive : styles.navItemInactive}`}
					onClick={() => onPageChange("dashboard")}
				>
					<Image
						className={activePage === "dashboard" ? styles.iconWhite : ""}
						src="tdbIcon.svg"
						alt=""
						width={24}
						height={24}
					/>
					Tableau de bord
				</button>

				<button
					className={`${styles.navItem} ${activePage === "projets" ? styles.navItemActive : styles.navItemInactive}`}
					onClick={() => onPageChange("projets")}
				>
					<Image
						className={activePage === "projets" ? styles.iconWhite : ""}
						src="projetIcon.svg"
						alt=""
						width={29}
						height={22.49}
					/>
					Projets
				</button>
			</div>

			{/* Avatar utilisateur */}
			<div className={styles.userIcon}>AD</div>
		</nav>
	);
}
