"use server";

import { cookies } from "next/headers";
import type { Task } from "@/types/types";

interface ResponseApi {
	message: string;
	data: Task | undefined;
}

export async function putTasksApi(
	idProject: string,
	idTask: string,
	title: string,
	description: string,
	status: "IN_PROGRESS" | "TODO" | "DONE",
	priority: "HIGH" | "LOW" | "MEDIUM",
	date: string,
	assigneeIds: string[],
): Promise<ResponseApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch(
			"http://localhost:8000/projects/" + idProject + "/tasks/" + idTask,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: title,
					description: description,
					status: status,
					priority: priority,
					dueDate: date,
					assigneeIds: assigneeIds,
				}),
			},
		);
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data.task };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}

export async function postAddTasksApi(
	idProject: string,
	title: string,
	description: string,
	status: "IN_PROGRESS" | "TODO" | "DONE",
	priority: "HIGH" | "LOW" | "MEDIUM",
	date: string,
	assigneeIds: string[],
): Promise<ResponseApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch(
			"http://localhost:8000/projects/" + idProject + "/tasks/",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: title,
					description: description,
					status: status,
					priority: priority,
					dueDate: date,
					assigneeIds: assigneeIds,
				}),
			},
		);
		const data = await response.json();

		if (!response.ok) {
			console.log("reponse pas ok : ", data.message);
			return { message: data.message, data: undefined };
		}
		console.log("reponse ok : ", data.message);
		return { message: data.message, data: data.data.task };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}
