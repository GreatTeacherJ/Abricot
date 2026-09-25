import { createHash } from "crypto";

import prisma from "../lib/prisma";
import { encodingForModel } from "js-tiktoken";
// src/index.ts ou en tout début de point d'entrée
import dotenv from "dotenv";
dotenv.config(); // charge les variables du .env dans process.env

// Token MammouthAI
const MAMMOUTH_TOKEN = process.env.MAMMOUTH_TOKEN;

interface ErrorApi {
	error: {
		message: string;
		type: string;
		param: string;
		code: string;
	};
}

interface EmbeddingResponse {
	model: string;
	data: [
		{
			embedding: number[];
			index: number;
			object: string;
		},
	];
	object: string;
	usage: {
		completion_tokens: number;
		prompt_tokens: number;
		total_tokens: number;
		completion_tokens_details: number | null;
		prompt_tokens_details: number | null;
	};
}

//Crée uun hash de texte
export function hashContent(content: string): string {
	return createHash("sha256").update(content).digest("hex");
}

//Verie si toutes les tâche sont embedder et crée les embedding
export async function embeddingProject(projectId: string) {
	try {
		// 1. Récupérer le projet avec ses tâches et commentaires
		const project = await prisma.project.findUnique({
			where: { id: projectId },
			include: {
				tasks: {
					include: { comments: true },
				},
			},
		});

		if (!project) {
			throw new Error("Projet introuvable");
		}

		// 2. Récupérer les embeddings déjà existants pour ce projet
		//    (on ne garde que sourceId, pas besoin du reste ici)
		const existingChunks = await prisma.embeddingChunk.findMany({
			where: { projectId },
			select: { sourceId: true, contentHash: true },
		});

		// 3. Construire la liste des éléments candidats à l'embedding
		//Un embeding par tâche, limité à 20 commentaire
		const itemForEmbedding: {
			sourceType: string;
			sourceId: string;
			content: string;
			importType: "CREATE" | "UPDATE";
		}[] = [];

		//pour toutes les tâches du projet
		for (const task of project.tasks) {
			const content = JSON.stringify(task);
			const hash = hashContent(content);
			const hashExist = existingChunks.some((h) => h.contentHash === hash);
			//si il n'y a pas de corespondance
			if (!hashExist) {
				//on verifie si il faut mettre a jour la tâche
				const idExist = existingChunks.some((c) => c.sourceId === task.id);
				if (idExist) {
					itemForEmbedding.push({
						sourceType: "TASK",
						sourceId: task.id,
						content: content,
						importType: "UPDATE",
					});
				}
				//sinon on la crée
				else {
					itemForEmbedding.push({
						sourceType: "TASK",
						sourceId: task.id,
						content: content,
						importType: "CREATE",
					});
				}
			}
		}

		// 4. appeler l'API Mammouth pour chaque item et récupérer le vecteur
		for (const item of itemForEmbedding) {
			const embed = await embeddingPrompt(item.content);

			if (item.importType === "CREATE") {
				await prisma.embeddingChunk.create({
					data: {
						content: item.content,
						embedding: JSON.stringify(embed),
						sourceType: item.sourceType,
						sourceId: item.sourceId,
						projectId,
						contentHash: hashContent(item.content),
					},
				});
			} else if (item.importType === "UPDATE") {
				// on retrouve le chunk existant pour ce projet via sourceId (id de tâche)
				const existingChunk = await prisma.embeddingChunk.findFirst({
					where: { sourceId: item.sourceId, projectId },
				});
				if (!existingChunk) {
					throw new Error(`Chunk introuvable pour la tâche ${item.sourceId}`);
				}
				await prisma.embeddingChunk.update({
					where: { id: existingChunk.id },
					data: {
						content: item.content,
						embedding: JSON.stringify(embed),
						sourceType: item.sourceType,
						projectId,
						contentHash: hashContent(item.content),
					},
				});
			}
		}

		return { newlyEmbedded: itemForEmbedding.length };
	} catch (error: any) {
		throw error;
	}
}

export function isValidBody(body: any): body is { prompt: string } {
	return typeof body.prompt === "string";
}

export async function embeddingPrompt(prompt: string): Promise<number[]> {
	try {
		const response = await fetch("https://api.mammouth.ai/v1/embeddings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${MAMMOUTH_TOKEN}`,
			},
			body: JSON.stringify({
				model: "text-embedding-3-small",
				input: prompt,
			}),
		});

		const embed = await response.json();

		if (!response.ok) {
			const errorData = embed as ErrorApi;
			throw new Error(`API error (${response.status}): ${errorData.error.message}`);
		}

		return (embed as EmbeddingResponse).data[0].embedding;
	} catch (err) {
		// erreur réseau (pas de connexion, timeout, JSON invalide, etc.)
		console.error("Fetch failed:", err);
		throw err;
	}
}

// Calcule la similarité cosinus entre deux vecteurs
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
	// Produit scalaire (dot product)
	const dotProduct = vectorA.reduce(
		(sum, value, index) => sum + value * vectorB[index],
		0,
	);

	// Norme (magnitude) de chaque vecteur
	const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
	const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));

	// Similarité cosinus = cos(angle) entre les deux vecteurs
	return dotProduct / (magnitudeA * magnitudeB);
}

export async function tokenSize(taskIds: string[]): Promise<number> {
	const tasks = await prisma.task.findMany({
		where: {
			id: {
				in: taskIds,
			},
		},
		include: { comments: true },
	});

	const text = JSON.stringify(tasks);
	const enc = encodingForModel("gpt-4o");
	const size = enc.encode(text).length;

	return size;
}
