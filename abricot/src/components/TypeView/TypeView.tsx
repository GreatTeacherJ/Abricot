import styles from "./TypeView.module.css";
import Image from "next/image";

/** Props de l'en-tête du tableau de bord */
interface PageHeaderProps {
	/** Vue active : liste ou kanban */
	activeView: "list" | "kanban";
	/** Callback de changement de vue */
	onViewChange: (view: "list" | "kanban") => void;
}

export default function AccountForm({ activeView, onViewChange }: PageHeaderProps) {
	return (
		/* Chips Liste/Kanban + bouton création */
		<div className={styles.actions}>
			<div className={styles.chips}>
				<button
					className={`${styles.chip} ${activeView === "list" ? styles.chipActive : styles.chipInactive}`}
					onClick={() => onViewChange("list")}
				>
					<Image src="listIcon.svg" alt="" width={16} height={16} />
					Liste
				</button>
				<button
					className={`${styles.chip} ${activeView === "kanban" ? styles.chipActive : styles.chipInactive}`}
					onClick={() => onViewChange("kanban")}
				>
					<Image src="kanbanIcon.svg" alt="" width={16} height={16} />
					Kanban
				</button>
			</div>
		</div>
	);
}
