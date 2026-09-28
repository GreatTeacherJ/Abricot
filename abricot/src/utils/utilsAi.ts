"use server";

import type { Project } from "@/types/types";

import { responseCatch } from "./tools";
import { PROMPT_HEADER, NO_TASK_MESSAGE } from "@/lib/promptHeader";
import { getAllTaskForProjectApi } from "./utilsProject";
import { postEmbeddingApi } from "@/utils/utilsEmbedding";
import type { ResponseApi } from "@/types/types";

import dotenv from "dotenv";
dotenv.config(); // charge les variables du .env dans process.env

// Token MammouthAI
const MAMMOUTH_TOKEN = process.env.MAMMOUTH_TOKEN;

const API_MAMMOUTH = true;

interface ResponseMAMMOUTH {
	choices: [
		{
			message: {
				content: string;
			};
		},
	];
}

export async function callModelApi(
	project: Project,
	message: string,
	lengthEmbed?: number,
): Promise<ResponseApi<ResponseMAMMOUTH>> {
	try {
		const tasksText: string[] = [];
		console.log("debut embeding");

		const resTaskIds = await postEmbeddingApi(project.id, message, lengthEmbed);
		if (resTaskIds.success) {
			console.log("fin embeding / debut model\n", resTaskIds.data);
			//Recupérer toutes les tâches du projet
			const resTask = await getAllTaskForProjectApi(project.id);
			console.log("fin de l'appel model");
			if (resTask.success) {
				//trié les tache en fonction de la liste
				const tasksFilter = resTask.data.tasks.filter((task) =>
					resTaskIds.data.taskIds.some((t) => t === task.id),
				);
				tasksFilter.forEach((t) => tasksText.push(JSON.stringify(t)));
			} else {
				tasksText.push(NO_TASK_MESSAGE);
			}
		} else {
			tasksText.push(NO_TASK_MESSAGE);
		}
		console.log("Liste de tache : ", tasksText);
		//créer le prompt avec entête et tâche existante
		const prompt =
			"Projet en cours : " +
			JSON.stringify(project) +
			"\n tâche pertinante déja créée du projet : " +
			tasksText.join("\n") +
			"\nrequête utilisateur : " +
			message;
		console.log("Prompt envoyer : ", prompt);

		let res;
		if (!API_MAMMOUTH) {
			//=======Modele Local===============
			res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: prompt }),
			});
		} else {
			//==============API MAMMOUTH===================
			res = await fetch("https://api.mammouth.ai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${MAMMOUTH_TOKEN}`,
				},
				body: JSON.stringify({
					model: "gpt-6-luna",
					messages: [
						{
							role: "system",
							content: PROMPT_HEADER,
						},
						{
							role: "user",
							content: prompt,
						},
					],
				}),
			});
		}

		console.log("reponse mammouth : ", res);
		if (!res.ok) {
			const errorBody = await res.json().catch(() => null);
			console.error("Erreur serveur:", res.status, errorBody);
			return responseCatch(errorBody);
		}

		const data = await res.json();

		return {
			success: true,
			message: "Message Mammouth reçu",
			data: data,
		};
	} catch (error) {
		console.error("Erreur fetch /api/chat:", error);
		return responseCatch(error);
	}
}
