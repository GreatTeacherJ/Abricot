"use server";

import { cookies } from "next/headers";

import type { Projects, Tasks, User, Success, Error } from "@/types/types";

interface AssignedTskApi {
	message: string;
	data: Tasks | undefined;
}

interface ProjetApi {
	message: string;
	data: Projects | undefined;
}

interface ProfilApi {
	message: string;
	data: User | undefined;
}

type ResponseApi = Success | Error;

export async function profilApi(): Promise<ProfilApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch("http://localhost:8000/auth/profile", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token} `,
			},
		});
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data.user };
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

export async function putProfilApi(
	name: string,
	email: string,
	newPassword: string = "",
	oldPassword: string = "",
): Promise<ResponseApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return {
				success: false,
				message: "Token de connexion non trouvé",
				error: "Token de connexion non trouvé",
				details: [
					{
						field: "",
						message: "",
					},
				],
			};
		}

		const response = await fetch("http://localhost:8000/auth/profile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: name,
				email: email,
			}),
		});
		const data: ResponseApi = await response.json();

		if (!response.ok) {
			return data;
		}

		if (newPassword) {
			const resPassword = await putPassword(token, newPassword, oldPassword);
			if (!resPassword.success) {
				return resPassword;
			}
		}

		return data;
	} catch (err) {
		const message = "Erreur profilAPI:" + err;
		console.error(message);
		return {
			success: false,
			message: message,
			error: "" + err,
			details: [
				{
					field: "",
					message: "",
				},
			],
		};
	}
}

async function putPassword(
	token: string,
	newPassword: string,
	oldPassword: string,
): Promise<ResponseApi> {
	try {
		const response = await fetch("http://localhost:8000/auth/profile", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				currentPassword: oldPassword,
				newPassword: newPassword,
			}),
		});
		const data = await response.json();

		if (!response.ok) {
			return data;
		}
		return data;
	} catch (err) {
		const message = "Erreur mise a jour mot de passe :" + err;
		return {
			success: false,
			message: message,
			error: "" + err,
			details: [
				{
					field: "",
					message: "",
				},
			],
		};
	}
}
