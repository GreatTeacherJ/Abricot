import { useState, useRef } from "react";
import styles from "./AiModal.module.css";
import { postEmbeddingApi, callModelApi } from "@/utils/utilsAi";

const LINE_HEIGHT = 24; // doit correspondre exactement au line-height défini en CSS
const MAX_LINES = 4;
const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES;

type Message = {
	id: number;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
};
const f: Message = { id: 1, text: "salut salut", sender: "bot", timestamp: new Date() };

const teste = [f, f, f];

interface AiModalProps {
	idProject: string;
}
/** Modale de modification d'un projet (maquette Figma « Modale modifier projet ») */
export default function AiModal({ idProject }: AiModalProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	//texte pour les teste
	const [responseTxt, setResponseTxt] = useState<string>("");
	//message de l'utilisateur
	const [message, setMessage] = useState("");
	//reponse ia
	const [messages, setMessages] = useState<Message[]>([f, f, f]);
	//savoir si l'ia charge
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);

		const textarea = textareaRef.current;
		if (!textarea) return;

		// reset height pour mesurer la vraie taille du contenu
		// (sinon scrollHeight garde l'ancienne valeur quand on supprime du texte)
		textarea.style.height = "auto";
		const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
		textarea.style.height = `${newHeight}px`;
	};

	function onClose() {
		setIsOpen(false);
	}

	//Envoyer le prompt a l'API et recupérer la reponsse
	async function sendMessage() {
		if (!message.trim()) return;

		const userMessage: Message = {
			id: Date.now(),
			text: message,
			sender: "user",
			timestamp: new Date(),
		};
		//on ajoute le message de l'utilisateur dans la liste
		setMessages((prev) => [...prev, userMessage]);
		//on bloque le bouton
		setLoading(true);

		try {
			const taskIdsEmbed = postEmbeddingApi(idProject, message);
		} catch (error) {
			console.error("Erreur réseau:", error);
		} finally {
			setLoading(false);
		}
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	return (
		<>
			<button className={styles.aiBtn} onClick={() => setIsOpen(true)}>
				<svg
					width="19"
					height="19"
					viewBox="0 0 19 19"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.24333 0.574802C8.60336 -0.19163 9.69352 -0.19163 10.0535 0.574802L12.351 5.46554C12.4501 5.67658 12.6199 5.84634 12.8309 5.94548L17.7216 8.2429C18.4881 8.60293 18.4881 9.69309 17.7216 10.0531L12.8309 12.3505C12.6199 12.4497 12.4501 12.6194 12.351 12.8305L10.0535 17.7212C9.69352 18.4876 8.60336 18.4876 8.24333 17.7212L5.9459 12.8305C5.84677 12.6194 5.677 12.4497 5.46597 12.3505L0.575229 10.0531C-0.191203 9.69309 -0.191203 8.60293 0.575229 8.2429L5.46597 5.94547C5.677 5.84634 5.84677 5.67658 5.9459 5.46554L8.24333 0.574802Z"
						fill="white"
					/>
				</svg>
				IA
			</button>
			{isOpen && (
				<div className={styles.overlay} onClick={onClose}>
					<div
						className={styles.modal}
						role="dialog"
						aria-modal="true"
						aria-labelledby="project-edit-title"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Fermeture */}
						<button
							className={styles.closeBtn}
							onClick={onClose}
							aria-label="Fermer"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M1 1L13 13M13 1L1 13"
									stroke="currentColor"
									strokeWidth="1"
									strokeLinecap="round"
								/>
							</svg>
						</button>

						{/*Contenu */}
						<div className={styles.content}>
							{/*Reponse du model */}
							<div className={styles.responseContent}>
								<div className={styles.titleWrapper}>
									<svg
										width="19"
										height="19"
										viewBox="0 0 19 19"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M8.24333 0.574802C8.60336 -0.19163 9.69352 -0.19163 10.0535 0.574802L12.351 5.46554C12.4501 5.67658 12.6199 5.84634 12.8309 5.94548L17.7216 8.2429C18.4881 8.60293 18.4881 9.69309 17.7216 10.0531L12.8309 12.3505C12.6199 12.4497 12.4501 12.6194 12.351 12.8305L10.0535 17.7212C9.69352 18.4876 8.60336 18.4876 8.24333 17.7212L5.9459 12.8305C5.84677 12.6194 5.677 12.4497 5.46597 12.3505L0.575229 10.0531C-0.191203 9.69309 -0.191203 8.60293 0.575229 8.2429L5.46597 5.94547C5.677 5.84634 5.84677 5.67658 5.9459 5.46554L8.24333 0.574802Z"
											fill="#FF8B42"
										/>
									</svg>

									<h1 className={styles.title}>Créer une tâche</h1>
								</div>
								{messages.map((mes) => (
									<div className={styles.responseText}>
										<p>{mes.text}</p>
									</div>
								))}
								{loading && (
									<p className={styles.loading}>
										En cours de chargement
									</p>
								)}
							</div>

							{/*Input utilisateur */}
							<div className={styles.containerArea}>
								<textarea
									ref={textareaRef}
									value={message}
									onChange={handleChange}
									placeholder="Décrivez les tâches que vous souhaitez ajouter..."
									rows={1}
									className={styles.textarea}
									onKeyDown={handleKeyDown}
								/>
								<button
									className={styles.buttonArea}
									disabled={loading || !message.trim()}
									onClick={sendMessage}
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										className={styles.svgBtn}
									>
										<circle
											cx="12"
											cy="12"
											r="12"
											fill="currentColor"
										/>
										<path
											d="M11.6378 8.57072C11.7818 8.26415 12.2178 8.26415 12.3618 8.57072L13.2808 10.527C13.3205 10.6114 13.3884 10.6793 13.4728 10.719L15.4291 11.638C15.7357 11.782 15.7357 12.218 15.4291 12.362L13.4728 13.281C13.3884 13.3207 13.3205 13.3886 13.2808 13.473L12.3618 15.4293C12.2178 15.7359 11.7818 15.7359 11.6378 15.4293L10.7188 13.473C10.6791 13.3886 10.6112 13.3207 10.5268 13.281L8.57052 12.362C8.26395 12.218 8.26395 11.782 8.57052 11.638L10.5268 10.719C10.6112 10.6793 10.6791 10.6114 10.7188 10.527L11.6378 8.57072Z"
											fill="white"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
