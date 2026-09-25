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

type Message = {
	id: number;
	text: string;
	sender: "user" | "bot";
	timestamp: Date;
};

export async function postEmbeddingApi(
	idProject: string,
	prompt: string,
	lengthEmbed?: number,
): Promise<ResponseApi<Embedding>> {
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

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function callModelApi(prompt: string, taskIds: string[]) {
	try {
		const res = await fetch("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ prompt }),
		});

		if (!res.ok) {
			console.error("Erreur serveur:", res.status);
			return;
		}

		const data = await res.json();

		return data;
	} catch (error) {
		responseCatch(error);
	}
}
