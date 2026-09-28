"use client";

import { useState, useRef } from "react";
import styles from "./AiModal.module.css";
import { callModelApi } from "@/utils/utilsAi";
import type { Project, TasksBot, TaskBot } from "@/types/types";
import { BotText } from "@/utils/teste";
import { postAddTasksApi } from "@/utils/utilsTasks";
import { useProvider } from "../Provider/Provider";

const LINE_HEIGHT = 24; // doit correspondre exactement au line-height défini en CSS
const MAX_LINES = 4;
const MAX_HEIGHT = LINE_HEIGHT * MAX_LINES;

type Message = {
	id: number;
	text?: string;
	sender: "user" | "bot" | "Task";
	timestamp: Date;
	tasks?: TasksBot;
};

interface AiModalProps {
	project: Project;
}

/** Modale de modification d'un projet (maquette Figma « Modale modifier projet ») */
export default function AiModal({ project }: AiModalProps) {
	const { setRendering } = useProvider();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	//message de l'utilisateur
	const [message, setMessage] = useState("");
	//reponse ia
	const [messages, setMessages] = useState<Message[]>([]);
	//savoir si l'ia charge
	const [loading, setLoading] = useState(false);
	//Liste des tâche accépter par l'utilisateur
	const [userAddTasks, setuserAddTaskss] = useState<Map<string, TaskBot>>(new Map());
	//valeur de la tâche quand on appui sur le bouton
	const [idModied, setIdModified] = useState<string>();

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setMessage(e.target.value);

		const textarea = textareaRef.current;
		if (!textarea) return;

		// reset height pour mesurer la vraie taille du contenu
		// (sinon scrollHeight garde l'ancienne valeur quand on supprime du texte)
		textarea.style.height = "auto";
		const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
		textarea.style.height = `${newHeight}px`;
	}

	function handleInput(
		e: React.ChangeEvent<HTMLTextAreaElement>,
		idM: number,
		idx: number,
		type: "title" | "description",
	) {
		e.target.style.height = "auto";
		e.target.style.height = `${e.target.scrollHeight}px`;

		setMessages((prev) => {
			const update = [...prev];
			const currentTasks = update[idM].tasks;
			if (!currentTasks) return update;
			update[idM] = {
				...update[idM],
				tasks: {
					...currentTasks, // On remplace uniquement l'élément à l'index idx, les autres restent inchangés
					tasks: currentTasks.tasks.map((task, i) =>
						i === idx
							? {
									...task,
									[type]: e.target.value,
								}
							: task,
					),
				},
			};
			return update;
		});
	}

	function addTask() {
		setLoading(true);
		userAddTasks.forEach(async (t) => {
			try {
				const res = await postAddTasksApi(
					project.id,
					t.title,
					t.description,
					"TODO",
					"MEDIUM",
					t.dueDate,
					[],
				);
				if (!res.success) {
					const botMessage: Message = {
						id: 1,
						text: `Une érreur est survenue dans la création de la tâches ${t.title}, veuillez réésayer`,
						sender: "bot",
						timestamp: new Date(),
					};
					setMessages((prev) => [...prev, botMessage]);
					return;
				}
				const botMessage: Message = {
					id: (messages.at(-1)?.id ?? 0) + 1,
					text: `La tâche ${t.title} à été ajouter avec succés`,
					sender: "bot",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, botMessage]);
				setRendering((prev) => !prev);
			} catch (error) {
				console.error("Erreur réseau:", error);
			} finally {
				setLoading(false);
				setuserAddTaskss(new Map());
			}
		});
	}

	function onClose() {
		setMessage("");
		setIsOpen(false);
	}

	//Envoyer le prompt a l'API et recupérer la reponsse
	async function sendMessage() {
		if (!message.trim()) return;

		const userMessage: Message = {
			id: (messages.at(-1)?.id ?? 0) + 1,
			text: message,
			sender: "user",
			timestamp: new Date(),
		};
		//on ajoute le message de l'utilisateur dans la liste
		setMessages((prev) => [...prev, userMessage]);
		setMessage("");
		//on bloque le bouton
		setLoading(true);

		try {
			console.log("démmarage model");
			const res = await callModelApi(project, message);
			console.log("fin de callModele");
			console.log("Reponse IA : ", res);

			if (res.success) {
				const data: TasksBot = JSON.parse(res.data.choices[0].message.content);
				console.log("Pars : ", data);

				const botMessage: Message = {
					id: Date.now(),
					tasks: data,
					sender: "Task",
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, botMessage]);
			}
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
								{messages &&
									messages.map((mes, idM) =>
										mes.sender === "Task" ? (
											mes.tasks?.tasks.map((task, idx) => (
												<div
													className={`${styles.botTasksWrapper} ${
														idModied === `${idM}-${idx}`
															? styles.botTasksWrapperMdf
															: userAddTasks.has(
																		`${mes.id}-${idx}`,
																  )
																? styles.botTasksWrapperSlc
																: ""
													}`}
													key={`${mes.id}-${idx}`}
												>
													<div
														className={`${styles.botTaskTextWrp}`}
													>
														<div
															onClick={() =>
																setuserAddTaskss(
																	(prev) => {
																		if (
																			idModied ===
																			`${idM}-${idx}`
																		) {
																			return prev;
																		}
																		const key = `${mes.id}-${idx}`;
																		const updated =
																			new Map(prev);
																		if (
																			updated.has(
																				key,
																			)
																		) {
																			updated.delete(
																				key,
																			);
																		} else {
																			updated.set(
																				key,
																				task,
																			);
																		}
																		console.log(
																			userAddTasks,
																		);
																		return updated;
																	},
																)
															}
														>
															<textarea
																className={
																	styles.botTaskDesc +
																	" " +
																	styles.areaInput
																}
																value={task.title}
																onChange={(e) =>
																	handleInput(
																		e,
																		idM,
																		idx,
																		"title",
																	)
																}
																readOnly={
																	idModied !==
																	`${idM}-${idx}`
																}
															/>
														</div>
														<textarea
															className={
																styles.botTaskDesc +
																" " +
																styles.areaInput
															}
															value={task.description}
															onChange={(e) =>
																handleInput(
																	e,
																	idM,
																	idx,
																	"description",
																)
															}
															readOnly={
																idModied !==
																`${idM}-${idx}`
															}
														/>
													</div>
													<div className={styles.botTaskBtnWrp}>
														<button
															className={
																styles.botTaskButton
															}
															onClick={() =>
																setMessages((prev) => {
																	const update = [
																		...prev,
																	];
																	const currentTasks =
																		update[idM].tasks;

																	// Si tasks est undefined, on ne fait rien
																	if (!currentTasks)
																		return update;

																	update[idM] = {
																		...update[idM],
																		tasks: {
																			...currentTasks,
																			tasks: currentTasks.tasks.filter(
																				(_, i) =>
																					i !==
																					idx,
																			),
																		},
																	};
																	return update;
																})
															}
														>
															<svg
																width="16"
																height="14"
																viewBox="0 0 16 14"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M11.1973 3.96191H11.2012V11.957C11.201 13.035 10.2991 13.908 9.19043 13.9082H2.96094C1.84889 13.9081 0.951388 13.0351 0.951172 11.957V3.96191H0.954102V3.95898H11.1973V3.96191ZM8.30957 0.0341797C8.44372 0.0341329 8.57719 0.0601006 8.70117 0.111328C8.8251 0.162624 8.93829 0.23825 9.0332 0.333008C9.12802 0.42782 9.20349 0.541202 9.25488 0.665039C9.30579 0.788043 9.33257 0.920612 9.33301 1.05371H11.5303C11.5449 1.05373 11.5598 1.05653 11.5742 1.05762L9.3291 1.05664L9.33008 1.05762H11.5303C11.5404 1.05763 11.5505 1.06005 11.5605 1.06055H11.6006C11.6129 1.06198 11.6255 1.06526 11.6377 1.06738C11.6466 1.06896 11.6553 1.07128 11.6641 1.07324C11.6975 1.08049 11.73 1.09011 11.7617 1.10254C11.7636 1.10331 11.7657 1.1037 11.7676 1.10449C11.8419 1.1345 11.9108 1.17756 11.9688 1.23535C12.0849 1.35148 12.1501 1.50962 12.1504 1.67383V2.20215C12.1502 2.28323 12.1336 2.3636 12.1025 2.43848C12.0713 2.51352 12.0254 2.58227 11.9678 2.63965C11.9103 2.69678 11.8425 2.74253 11.7676 2.77344C11.6925 2.80435 11.6115 2.82045 11.5303 2.82031H0.618164C0.537116 2.82039 0.455769 2.80438 0.380859 2.77344C0.306207 2.7425 0.237862 2.69673 0.180664 2.63965C0.123467 2.58235 0.0778239 2.51329 0.046875 2.43848C0.0160196 2.36366 -8.13692e-05 2.28308 0 2.20215V1.67383C-8.46362e-05 1.59267 0.014965 1.51155 0.0458984 1.43652C0.0768758 1.36151 0.122397 1.29284 0.179688 1.23535C0.237004 1.17786 0.305922 1.13278 0.380859 1.10156C0.455797 1.0704 0.537005 1.05388 0.618164 1.05371H2.81543C2.81545 1.0297 2.81666 1.00533 2.81836 0.981445V1.05762L2.82031 1.00586V0.945312C2.83062 0.849339 2.85468 0.754632 2.8916 0.665039C2.94288 0.540775 3.01823 0.427087 3.11328 0.332031C3.20834 0.236982 3.32203 0.161623 3.44629 0.110352C3.5703 0.0592494 3.70376 0.0338671 3.83789 0.0341797H8.30957ZM15.6992 1.06055H11.6006C11.592 1.05954 11.5829 1.05825 11.5742 1.05762L15.6992 1.06055ZM2.82031 0.945312C2.81905 0.957152 2.81918 0.969555 2.81836 0.981445V0L2.82031 0.945312Z"
																	fill="#9CA3AF"
																/>
															</svg>
															Supprimer
														</button>
														<p>|</p>
														<button
															className={`${styles.botTaskButton} 
																${idModied === `${idM}-${idx}` ? styles.btnModifyAct : ""}`}
															onClick={() =>
																setIdModified((prev) => {
																	if (
																		prev ===
																		`${idM}-${idx}`
																	)
																		return "";
																	return `${idM}-${idx}`;
																})
															}
														>
															<svg
																width="14"
																height="14"
																viewBox="0 0 14 14"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M6.84794 2.94397L0.538902 9.25301C0.451971 9.33998 0.397399 9.45406 0.384248 9.57632L0.00327009 13.004C-0.0050645 13.0794 0.00257643 13.1556 0.025694 13.2277C0.0488115 13.2999 0.0868858 13.3664 0.137432 13.4228C0.187978 13.4792 0.24986 13.5244 0.319037 13.5553C0.388215 13.5862 0.463133 13.6022 0.538902 13.6022C0.558705 13.6022 0.578492 13.6011 0.598178 13.599L4.02806 13.218C4.15032 13.2048 4.2644 13.1503 4.35138 13.0633L10.6583 6.75483L6.84794 2.94397Z"
																	fill="#6B7280"
																/>
																<path
																	d="M13.1294 1.99777L11.605 0.473317C11.3018 0.170252 10.8907 0 10.462 0C10.0334 0 9.62225 0.170252 9.31909 0.473317L7.61035 2.18206L11.4207 5.99292L13.1299 4.28363C13.4329 3.98041 13.6031 3.56925 13.603 3.14059C13.6029 2.71193 13.4325 2.30085 13.1294 1.99777Z"
																	fill="#6B7280"
																/>
															</svg>
															Modifier
														</button>
													</div>
												</div>
											))
										) : (
											<div
												key={mes.id}
												className={`${styles.responseText} ${mes.sender === "user" ? styles.userMessage : ""}`}
											>
												<p>{mes.text}</p>
											</div>
										),
									)}
								{loading && (
									<p className={styles.loading}>
										En cours de chargement
									</p>
								)}
							</div>
							{userAddTasks.size > 0 && (
								<button onClick={addTask} className={styles.addTasksBtn}>
									+ Ajouter les tâches ({userAddTasks.size})
								</button>
							)}
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
