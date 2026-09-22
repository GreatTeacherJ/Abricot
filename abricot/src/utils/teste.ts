const cookie =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbXUzMG1sd3gwMDAwdjNtazFra2owemppIiwiZW1haWwiOiJhbGljZUBleGFtcGxlLmNvbSIsImlhdCI6MTc4OTU3MzU0MSwiZXhwIjoxNzkwMTc4MzQxfQ.a_ai_HQ9puZaInn6Y6qr_IMn6aWcKij_LhE6i7JU2hQ";

export async function profilApi(): Promise<string> {
	try {
		const response = await fetch("http://localhost:8000/auth/profile", {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookie} `,
			},
		});
		const data = await response.json();

		if (!response.ok) {
			return data.message;
		}

		const id = data.id;

		return id;
	} catch (error) {
		const message = "Erreur profilAPI:" + error;
		console.error(message);
		return message;
	}
}
const res = profilApi();
console.log(res);
