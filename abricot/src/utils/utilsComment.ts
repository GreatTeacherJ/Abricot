"use server";

import { cookies } from "next/headers";
import type { Comment, ResponseApi } from "@/types/types";
import { responseToken, responseCatch } from "./tools";

export async function postCommentApi(
	idProject: string,
	idTask: string,
	comment: string,
): Promise<ResponseApi<Comment>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
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

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}
