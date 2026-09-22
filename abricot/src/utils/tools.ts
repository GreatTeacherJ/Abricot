export function getInitials(name: string): string {
	return name
		.split("-")
		.filter(Boolean) // évite les tirets multiples/en trop
		.map((word) => word[0].toUpperCase())
		.join("")
		.slice(0, 2); // limite à 2 caractères, convention avatar standard
}
