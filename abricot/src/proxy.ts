import { NextRequest, NextResponse } from "next/server";

// Routes accessibles sans authentification
const publicRoutes = ["/connexion", "/inscription"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Laisse passer les routes publiques sans vérification
	if (publicRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.next();
	}

	const token = request.cookies.get("tokenAbricot")?.value;

	if (!token) {
		const loginUrl = new URL("/connexion", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

// Applique le middleware à toutes les routes sauf assets statiques et API
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
