"use server";

import { cookies } from "next/headers";

interface ResponseLog {
	message: string;
	data:
		| {
				success: true;
				message: string;
				data: {
					user: {
						id: string;
						email: string;
						name: string;
						createdAt: string;
						updatedAt: string;
					};
					token: string;
				};
		  }
		| undefined;
}

export async function loginAPI(email: string, password: string): Promise<ResponseLog> {
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
				return { message: "Token non reçu", data: data };
			}
		} else {
			return { message: "Erreur serveur", data: data };
		}

		// httpOnly = inaccessible en JS côté navigateur, protège du XSS
		const cookieStore = await cookies();
		cookieStore.set("tokenAbricot", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60, // 1h en secondes, pas en jours comme js-cookie
		});

		return { message: "connecté", data: data };
	} catch (error) {
		const message = "Erreur loginAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}

export async function registerAPI(
	email: string,
	password: string,
	name: string,
): Promise<ResponseLog> {
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
				return { message: "Token non reçu", data: data };
			}
		} else {
			return data.message;
		}

		const cookieStore = await cookies();
		cookieStore.set("tokenAbricot", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60, // 1h en secondes, pas en jours comme js-cookie
		});
		return { message: "compte créé", data: data };
	} catch (error) {
		const message = "Erreur registerAPI:" + error;
		console.error(message);
		return { message: message, data: undefined };
	}
}
