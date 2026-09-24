"use server";

import { cookies } from "next/headers";
import type { Task, ResponseApi } from "@/types/types";
import { responseToken, responseCatch } from "./tools";

export async function putTasksApi(
	idProject: string,
	idTask: string,
	title: string,
	description: string,
	status: "IN_PROGRESS" | "TODO" | "DONE",
	priority: "HIGH" | "LOW" | "MEDIUM",
	date: string,
	assigneeIds: string[],
): Promise<ResponseApi<Task>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
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

		return data;
	} catch (error) {
		return responseCatch(error);
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
): Promise<ResponseApi<Task>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
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

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function deleteTaskApi(idProject: string, idTask: string) {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch(
			"http://localhost:8000/projects/" + idProject + "/tasks/" + idTask,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}
