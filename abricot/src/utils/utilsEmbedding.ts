"use server";

import type { ResponseApi } from "@/types/types";
import { cookies } from "next/headers";
import { responseToken, responseCatch } from "./tools";

interface Embedding {
	newlyEmbedded: number;
	taskIds: string[];
	tokenSize: number;
	maxId: number;
}
interface RequestBody {
	prompt: string;
	lengthEmbed?: number; // optionnel dès le départ
}

export async function postEmbeddingApi(
	idProject: string,
	prompt: string,
	lengthEmbed?: number,
): Promise<ResponseApi<Embedding>> {
	if (lengthEmbed && lengthEmbed < 1) {
		return {
			success: false,
			message: "",
			error: "",
			details: [
				{
					field: "",
					message: "",
				},
			],
		};
	}

	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		let body: RequestBody = { prompt: prompt };

		if (lengthEmbed) {
			body = { ...body, lengthEmbed: lengthEmbed };
			// ou plus simple : body.lengthEmbed = lengthEmbed;
		}
		const response = await fetch("http://localhost:8000/embeddings/" + idProject, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});
		const data = await response.json();
		console.log("embedding : ", data);
		return {
			success: true,
			message: "Embedding créé",
			data: data.data,
		};
	} catch (error) {
		return responseCatch(error);
	}
}
