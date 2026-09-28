"use server";

import { cookies } from "next/headers";
import { responseToken, responseCatch } from "./tools";
import type { Projects, Tasks, User, Users, ResponseApi } from "@/types/types";

export async function profilApi(): Promise<ResponseApi<{ user: User }>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch("http://localhost:8000/auth/profile", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token} `,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function assignedTskApi(): Promise<ResponseApi<Tasks>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}
		console.log("assignedTaskAPI token : ", token);

		const response = await fetch("http://localhost:8000/dashboard/assigned-tasks", {
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

export async function projectsApi(): Promise<ResponseApi<Projects>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch("http://localhost:8000/projects", {
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

export async function taskForProjectApi(id: string): Promise<ResponseApi<Tasks>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}
		console.log("assignedTaskAPI token : ", token);

		const response = await fetch(`http://localhost:8000/projects/${id}/tasks`, {
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

export async function putProfilApi(
	name: string,
	email: string,
	newPassword: string = "",
	oldPassword: string = "",
): Promise<ResponseApi<User | null>[]> {
	try {
		const responseList: ResponseApi<User | null>[] = [];

		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return [responseToken()];
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
		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		if (newPassword) {
			const resPassword = await putPassword(token, newPassword, oldPassword);
			responseList.push(data);
			responseList.push(resPassword);
		}

		return data;
	} catch (error) {
		return [responseCatch(error)];
	}
}

async function putPassword(
	token: string,
	newPassword: string,
	oldPassword: string,
): Promise<ResponseApi<null>> {
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

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function getUserSearchApi(valueSearch: string): Promise<ResponseApi<Users>> {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("tokenAbricot");
		const token = cookie?.value;

		if (!token) {
			return responseToken();
		}

		const response = await fetch(
			"http://localhost:8000/users/search?query=" + valueSearch,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token} `,
				},
			},
		);
		const data = await response.json();

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}
