import { NextRequest, NextResponse } from "next/server";
import { sendToMammouthProcess } from "@/lib/mammouthClient";

let currentSessionId: string | null = null;

export async function POST(request: NextRequest) {
	const { message } = await request.json();

	if (!message) {
		return NextResponse.json({ error: "Message manquant" }, { status: 400 });
	}

	try {
		console.log("🚀 Lancement mammouth...");
		const { text, sessionId } = await sendToMammouthProcess(
			message,
			currentSessionId,
		);
		currentSessionId = sessionId; // Garde le sessionId pour la prochaine requête
		console.log("✅ Réponse:", text);
		return NextResponse.json({ response: text });
	} catch (error) {
		console.error("❌ Erreur:", error);
		return NextResponse.json({ error: "Erreur mammouth" }, { status: 500 });
	}
}
