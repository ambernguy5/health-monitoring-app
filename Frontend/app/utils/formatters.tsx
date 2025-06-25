export function formatHHMMSSTo12HourClock(hhmmss: string): string {
	if (!hhmmss || hhmmss.length < 6) return "--:--";

	const h = parseInt(hhmmss.slice(0, 2), 10);
	const m = parseInt(hhmmss.slice(2, 4), 10);

	if (isNaN(h) || isNaN(m)) return "--:--";

	const suffix = h >= 12 ? "PM" : "AM";
	const hour12 = ((h + 11) % 12 + 1); // Convert 0-23 to 1-12
	return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
}