import { spawn } from "child_process";

export function sendToMammouthProcess(
	userMessage: string,
	sessionId: string | null,
): Promise<{ text: string; sessionId: string }> {
	return new Promise((resolve, reject) => {
		const args = ["run", "--format", "json"];
		if (sessionId) args.push("--session", sessionId);
		args.push(userMessage);

		// Create new process for each message
		const process = spawn("mammouth", args, {
			shell: true,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";
		let isResolved = false;

		process.stdout?.on("data", (chunk) => {
			stdout += chunk.toString();
		});

		process.stderr?.on("data", (chunk) => {
			stderr += chunk.toString();
		});

		const timeoutId = setTimeout(() => {
			if (!isResolved) {
				isResolved = true;
				process.kill();
				reject(new Error("Mammouth timeout"));
			}
		}, 15000);

		process.on("close", (code) => {
			if (isResolved) return;
			isResolved = true;
			clearTimeout(timeoutId);

			if (code !== 0) {
				return reject(new Error(`Mammouth exited with code ${code}`));
			}

			let responseText = "";
			let newSessionId = sessionId ?? "";

			for (const line of stdout.trim().split("\n")) {
				if (!line) continue;
				try {
					const event = JSON.parse(line);
					newSessionId = event.sessionID ?? newSessionId;
					if (event.type === "text" && event.part?.text) {
						responseText += event.part.text;
					}
				} catch (e) {
					// Invalid JSON, skip
				}
			}

			resolve({ text: responseText, sessionId: newSessionId });
		});

		process.on("error", reject);
	});
}
