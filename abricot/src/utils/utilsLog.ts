"use server";

import { cookies } from "next/headers";
import { responseToken, responseCatch } from "./tools";
import type { ResponseApi, User } from "@/types/types";

interface LoginApi {
	user: User;
	token: string;
}

export async function loginAPI(
	email: string,
	password: string,
): Promise<ResponseApi<LoginApi>> {
	try {
		const response = await fetch("http://localhost:8000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: email, password: password }),
		});
		const data = await response.json();
		const token = data.data?.token;
		if (response.ok) {
			if (!token) {
				return responseToken();
			}
		} else {
			return data;
		}

		// httpOnly = inaccessible en JS côté navigateur, protège du XSS
		const cookieStore = await cookies();
		cookieStore.set("tokenAbricot", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60, // 1h en secondes, pas en jours comme js-cookie
		});

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}

export async function registerAPI(
	email: string,
	password: string,
	name: string,
): Promise<ResponseApi<LoginApi>> {
	try {
		const response = await fetch("http://localhost:8000/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: email, password: password, name: name }),
		});
		const data = await response.json();
		const token = data.data?.token;
		if (response.ok) {
			if (!token) {
				return responseToken();
			}
		} else {
			return data;
		}

		const cookieStore = await cookies();
		cookieStore.set("tokenAbricot", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60, // 1h en secondes, pas en jours comme js-cookie
		});

		return data;
	} catch (error) {
		return responseCatch(error);
	}
}
