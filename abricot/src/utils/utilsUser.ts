"use server";

import { cookies } from "next/headers";

import type { Projects, Tasks } from "@/types/types";

interface AssignedTskApi {
	message: string;
	data: Tasks | undefined;
}

interface ProjetApi {
	message: string;
	data: Projects | undefined;
}

export async function profilApi(): Promise<string> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return "Token non trouvé";
		}

		const response = await fetch("http://localhost:8000/auth/profile", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token} `,
			},
		});
		const data = await response.json();

		if (!response.ok) {
			return data.message;
		}

		const id = data.data.id;

		return id;
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return message;
	}
}

export async function assignedTskApi(): Promise<AssignedTskApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}
		console.log("assignedTaskAPI token : ", token);

		const response = await fetch("http://localhost:8000/dashboard/assigned-tasks", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
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

export async function projectsApi(): Promise<ProjetApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch("http://localhost:8000/projects", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data.projects };
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const message = `Erreur profilAPI: ${errorMessage}`;

		console.error(message, error); // log complet côté serveur/console, avec stack trace

		return {
			message,
			data: undefined, // on respecte le type : list vide en cas d'erreur
		};
	}
}

export async function taskForProjectApi(id: string): Promise<AssignedTskApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}
		console.log("assignedTaskAPI token : ", token);

		const response = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
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
