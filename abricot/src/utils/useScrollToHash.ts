// abricot/src/app/hooks/useScrollToHash.ts
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to the element referenced by the URL hash (#element-id),
 * retrying until the element appears in the DOM (useful when content
 * is rendered after an async fetch).
 */
export function useScrollToHash() {
	const pathname = usePathname();

	useEffect(() => {
		const hash = window.location.hash;
		if (!hash) return;

		const targetId = hash.replace("#", "");
		let attempts = 0;
		const maxAttempts = 20; // stops after ~2s (20 * 100ms) to avoid infinite loop

		// Polling because we don't know exactly when the fetched data
		// will be rendered — a MutationObserver would be cleaner but
		// adds complexity for a one-shot scroll action
		const interval = setInterval(() => {
			const element = document.getElementById(targetId);

			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
				clearInterval(interval);
			}

			attempts++;
			if (attempts >= maxAttempts) {
				clearInterval(interval); // give up silently, element never appeared
			}
		}, 100);

		return () => clearInterval(interval); // cleanup si le composant unmount
	}, [pathname]);
}
