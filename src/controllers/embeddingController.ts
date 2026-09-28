import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { sendSuccess, sendServerError, sendError } from "../utils/response";
import {
	tokenSize,
	embeddingProject,
	isValidBody,
	embeddingPrompt,
	cosineSimilarity,
} from "../utils/embedding";

import dotenv from "dotenv";
dotenv.config(); // charge les variables du .env dans process.env

/**
 * Génère et sauvegarde les embeddings manquants pour un projet donné.
 * Parcourt les tâches du projet, vérifie lesquels
 * n'ont pas encore de chunk d'embedding, puis les crée.
 */
export async function generateProjectEmbeddings(
	req: Request,
	res: Response,
): Promise<void> {
	try {
		const { projectId } = req.params;
		const { prompt, lengthEmbed } = req.body;
		let topK = 5;

		console.log("req.body reçu:", req.body);
		console.log("typeof prompt:", typeof req.body?.prompt);

		//Verifie si body est de type string
		if (!isValidBody(req.body)) {
			sendError(res, "prompt non valide");
			return;
		}

		//on vérifie si lengthEmbed existe
		if (lengthEmbed) {
			topK = lengthEmbed;
		}

		//Verifie si tous le projet est embeder
		const newlyEmbedded = await embeddingProject(projectId);

		// 1. On crée l'embedding du prompt
		const embedPrompt = await embeddingPrompt(prompt);

		// 2. Récupérer tous les embeddings du projet
		const candidates = await prisma.embeddingChunk.findMany({
			where: { projectId },
		});

		// 3-4. Désérialiser et calculer la similarité pour chaque candidat
		const scoredCandidates = candidates.map((candidate) => {
			let candidateVector: number[];
			try {
				candidateVector = JSON.parse(candidate.embedding);
			} catch (err) {
				throw new Error(
					`Embedding mal formé pour le chunk ${candidate.id}: ${candidate.embedding}`,
				);
			}
			const score = cosineSimilarity(embedPrompt, candidateVector);
			return { id: candidate.id, sourceId: candidate.sourceId, score };
		});

		// 5. Trier par score décroissant et garder le top-K
		scoredCandidates.sort((a, b) => b.score - a.score);
		const topCandidates = scoredCandidates.slice(0, topK);
		const taskIds = topCandidates.map((scr) => scr.sourceId);

		//Recupérer la taille en token aproximatif car dépend du model
		const tktSize = await tokenSize(taskIds);

		sendSuccess(res, "Embeddings générés avec succès", {
			newlyEmbedded: newlyEmbedded.newlyEmbedded,
			taskIds,
			tokenSize: tktSize,
			maxId: scoredCandidates.length,
		});
	} catch (error: any) {
		sendServerError(
			res,
			"Erreur lors de la génération des embeddings",
			error.message,
		);
	}
}
