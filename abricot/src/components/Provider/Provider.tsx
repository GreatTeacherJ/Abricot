// abricot/src/context/AuthContext.tsx
"use client"; // nécessaire : Context API utilise useState/useEffect, donc composant client

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { profilApi } from "@/utils/utilsUser";
import type { User } from "@/types/types";

// 1. Définir le type des données partagées
interface AuthContextType {
	currentUser: User | null;
}

// 2. Créer le contexte avec une valeur par défaut (undefined pour forcer l'usage via le hook)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Le Provider : composant qui encapsule la logique et fournit la valeur
export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		async function apiUser() {
			const data = await profilApi();

			if (!data.data) {
				return;
			}

			setCurrentUser(data.data);
		}
		apiUser();
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
	);
}

// 4. Hook custom pour consommer le contexte facilement
export function useProvider() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth doit être utilisé dans un AuthProvider");
	}
	return context;
}
