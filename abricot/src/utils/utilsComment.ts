"use server";

import { cookies } from "next/headers";
import type { Comments } from "@/types/types";

interface ResponseApi {
	message: string;
	data: Comments | undefined;
}

export async function postCommentApi(
	idProject: string,
	idTask: string,
	comment: string,
): Promise<ResponseApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch(
			"http://localhost:8000/projects/" +
				idProject +
				"/tasks/" +
				idTask +
				"/comments",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ content: comment }),
			},
		);
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data.tasks };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}
