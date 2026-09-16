import Image from "next/image";
import styles from "./Footer.module.css";

/** Pied de page avec copyright */
export default function Footer() {
	return (
		<footer className={styles.footer}>
			<Image src="iconBlack.svg" alt="" width={100} height={13} />
			<span className={styles.logo}>Abricot 2025</span>
		</footer>
	);
}
