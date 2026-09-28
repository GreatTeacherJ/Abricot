// abricot/src/app/hooks/useScrollToHash.ts
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

//Attend avant de naviguer automatiquement vers les refence "#"
export function useScrollToHash() {
	const pathname = usePathname();

	useEffect(() => {
		const hash = window.location.hash;
		if (!hash) return;

		const targetId = hash.replace("#", "");
		let attempts = 0;
		const maxAttempts = 20;

		const interval = setInterval(() => {
			const element = document.getElementById(targetId);

			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
				clearInterval(interval);
			}

			attempts++;
			if (attempts >= maxAttempts) {
				clearInterval(interval);
			}
		}, 100);

		return () => clearInterval(interval);
	}, [pathname]);
}
