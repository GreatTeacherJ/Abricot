import type { Error } from "@/types/types";

export function getInitials(name: string): string {
	return name
		.split("-")
		.filter(Boolean) // évite les tirets multiples/en trop
		.map((word) => word[0].toUpperCase())
		.join("")
		.slice(0, 2); // limite à 2 caractères, convention avatar standard
}

export function responseToken(): Error {
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

export function responseCatch(error: unknown): Error {
	const errorMessage = error instanceof Error ? error.message : String(error);
	const message = `getUserSearchApi: ${errorMessage}`;

	return {
		success: false,
		message: message,
		error: errorMessage,
		details: [
			{
				field: "",
				message: "",
			},
		],
	};
}
