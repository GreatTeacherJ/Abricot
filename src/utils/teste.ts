// test.ts
import { encodingForModel } from "js-tiktoken";
import prisma from "../lib/prisma";

async function test() {
	const project = await prisma.project.findUnique({
		where: { id: "cmu30mmd5000bv3mky8xsehtm" },
		include: {
			tasks: {
				include: { comments: true },
			},
		},
	});

	if (!project) {
		return;
	}

	const list = project.tasks[1].comments.map((c) => c.content).join("\n");

	const encoder = encodingForModel("text-embedding-3-small");
	const tokens = encoder.encode(list);
	console.log("=====================\nCOMMENTAIRES", list);
	console.log("taille du token : ", tokens.length);
}
const testjson = {
	a: "coucou",
	b: "salut",
	c: "sa va",
};

const str = JSON.stringify(testjson);
const pars = JSON.parse(str);

console.log(str + "\n" + pars);
