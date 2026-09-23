"use server";

import { cookies } from "next/headers";
import type { Project, User, ResponseApi, Projects } from "@/types/types";
import { responseToken, responseCatch } from "./tools";

export async function getProjectApi(
	idProject: string,
): Promise<ResponseApi<{ project: Project }>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch("http://localhost:8000/projects/" + idProject, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function getAllProjectApi(): Promise<ResponseApi<Projects>> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get("tokenAbricot");
	const token = cookie?.value;

	if (!token) {
		return responseToken();
	}
	try {
		const response = await fetch("http://localhost:8000/projects/", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function putProjectApi(
	idProject: string,
	title: string,
	description: string,
	addedMembers: User[] = [],
	removedMembers: User[] = [],
): Promise<ResponseApi<Project | null>[]> {
	const responseList: ResponseApi<Project | null>[] = [];
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return [responseToken()];
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
			return [data];
		}

		//Ajouter les collaborateur
		if (addedMembers) {
			for (const Member of addedMembers) {
				const results = await postContributors(token, Member.email, idProject);

				responseList.push(results);
			}
		}

		//Supprimer les collaborateur
		if (removedMembers) {
			for (const Member of removedMembers) {
				const results = await deleteContributors(token, Member.id, idProject);

				responseList.push(results);
			}
		}

		return responseList;
	} catch (error) {
		return [responseCatch(error)];
	}
}

async function postContributors(
	token: string,
	email: string,
	idProject: string,
): Promise<ResponseApi<null>> {
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
		return responseCatch(error);
	}
}

async function deleteContributors(
	token: string,
	idUser: string,
	idProject: string,
): Promise<ResponseApi<null>> {
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
		return responseCatch(error);
	}
}

export async function deleteProjectApi(idProject: string): Promise<ResponseApi<null>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch("http://localhost:8000/projects/" + idProject, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function postCreatProjectApi(
	title: string,
	description: string,
	userContributor: User[],
): Promise<ResponseApi<Project>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
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

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}
