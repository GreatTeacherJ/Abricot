"use server";

import { cookies } from "next/headers";
import type { Project, User } from "@/types/types";

interface ProjectApi {
	message: string;
	data: Project | undefined;
}

interface GetAllProjectApi {
	message: string;
	data: Project[] | undefined;
}

interface ResponseApi {
	success: boolean;
	message: string;
	data: {} | undefined;
}

interface ProjectApi {
	message: string;
	data: Project | undefined;
}

interface PutProjectApi {
	success: Boolean;
	message: string[];
	data: Project | undefined;
}

export async function getProjectApi(idProject: string): Promise<ProjectApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const response = await fetch("http://localhost:8000/projects/" + idProject, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data.project };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}

export async function getAllProjectApi(): Promise<GetAllProjectApi> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get("tokenAbricot");
	const token = cookie?.value;

	if (!token) {
		return { message: "Token non trouvé", data: undefined };
	}
	try {
		const response = await fetch("http://localhost:8000/projects/", {
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
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}

export async function putProjectApi(
	idProject: string,
	title: string,
	description: string,
	addedMembers: User[] = [],
	removedMembers: User[] = [],
): Promise<PutProjectApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { success: false, message: ["Token non trouvé"], data: undefined };
		}

		const response = await fetch("http://localhost:8000/projects/" + idProject, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: title,
				description: description,
			}),
		});
		const data = await response.json();

		if (!response.ok) {
			return { success: false, message: data.message, data: undefined };
		}

		let success = true;
		const message = [data.message];

		//Ajouter les collaborateur
		if (addedMembers) {
			for (const Member of addedMembers) {
				const results = await postContributors(token, Member.email, idProject);

				if (!results.success) {
					success = false;
					message.push(results.message);
				}
			}
		}

		//Supprimer les collaborateur
		if (removedMembers) {
			for (const Member of removedMembers) {
				const results = await deleteContributors(token, Member.id, idProject);

				if (!results.success) {
					success = false;
					message.push(results.message);
				}
			}
		}

		return { success: success, message: message, data: data.data.projects };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { success: false, message: [message], data: undefined };
	}
}

async function postContributors(
	token: string,
	email: string,
	idProject: string,
): Promise<ResponseApi> {
	try {
		const response = await fetch(
			"http://localhost:8000/projects/" + idProject + "/contributors",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					email: email,
					role: "CONTRIBUTOR",
				}),
			},
		);
		const data = await response.json();

		return data;
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { success: false, message: message, data: undefined };
	}
}

async function deleteContributors(
	token: string,
	idUser: string,
	idProject: string,
): Promise<ResponseApi> {
	try {
		const response = await fetch(
			"http://localhost:8000/projects/" + idProject + "/contributors/" + idUser,
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
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { success: false, message: message, data: undefined };
	}
}

export async function postCreatProjectApi(
	title: string,
	description: string,
	userContributor: User[],
): Promise<ProjectApi> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return { message: "Token non trouvé", data: undefined };
		}

		const contributor = userContributor.map((user) => user.email);

		const response = await fetch("http://localhost:8000/projects/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: title,
				description: description,
				contributors: contributor,
			}),
		});
		const data = await response.json();

		if (!response.ok) {
			return { message: data.message, data: undefined };
		}

		return { message: data.message, data: data.data };
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}
