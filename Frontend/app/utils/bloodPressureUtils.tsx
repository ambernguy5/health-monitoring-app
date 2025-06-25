
import { formatHHMMSSTo12HourClock } from './formatters';

export async function fetchBloodPressureDataAndProcess(setChartData, setCurrentValue, setLoading, API_BASE_URL: string) {
	setLoading(true);
	try {
		const res = await fetch(`${API_BASE_URL}/timeseries`);
		const timeseries = await res.json();

		const labels = timeseries.map((entry) => {
			const hhmm = entry.time.slice(0, 4);
			const minutes = parseInt(hhmm.slice(2, 4), 10);
			return minutes % 10 === 0 ? formatHHMMSSTo12HourClock(entry.time) : "";
		});

		const systolic = timeseries.map((entry) => entry.data.systolic);
		const diastolic = timeseries.map((entry) => entry.data.diastolic);
		const average = timeseries.map((entry) => entry.data.average);

		const latestEntry = timeseries[timeseries.length - 1];
		setCurrentValue({
			systolic: latestEntry.data.systolic,
			diastolic: latestEntry.data.diastolic,
			average: latestEntry.data.average,
		});

		setChartData({
			labels: labels,
			datasets: [
				{
					data: systolic,
					color: () => "rgba(72, 61, 139, 1)",
					strokeWidth: 2,
				},
				{
					data: diastolic,
					color: () => "rgba(100, 149, 237, 1)",
					strokeWidth: 2,
				},
				{
					data: average,
					color: () => "rgba(147, 112, 219, 1)",
					strokeWidth: 2,
				},
			],
			legend: ["Systolic", "Diastolic", "Average"],
			labelIndexes: labels.map((label, i) => (label ? i : null)).filter(i => i !== null),
		});

	} catch (err) {
		console.error("Error fetching data:", err);
	} finally {
		setLoading(false);
	}
}

export function getDisplayValue(currentValue: any, selectedMetric: string): number | string {
	if (!currentValue) return "---";
	switch (selectedMetric) {
		case "systolic":
			return currentValue.systolic;
		case "diastolic":
			return currentValue.diastolic;
		case "average":
			return currentValue.average;
		default:
			return currentValue.systolic;
	}
}

export function getMetricColor(selectedMetric: string): string {
	switch (selectedMetric) {
		case "systolic":
			return "rgba(72, 61, 139, 1)";
		case "diastolic":
			return "rgba(100, 149, 237, 1)";
		case "average":
			return "rgba(147, 112, 219, 1)";
		default:
			return "#3498db";
	}
}