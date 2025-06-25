// app/(tabs)/calendar.tsx
import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import Svg, { Line } from "react-native-svg";
import Config from '../config';

const screenWidth = Dimensions.get("window").width;

function formatHHMMSSTo12HourClock(hhmmss: string): string {
	if (!hhmmss || hhmmss.length < 6) return "--:--";

	const h = parseInt(hhmmss.slice(0, 2), 10);
	const m = parseInt(hhmmss.slice(2, 4), 10);

	if (isNaN(h) || isNaN(m)) return "--:--";

	const suffix = h >= 12 ? "PM" : "AM";
	const hour12 = ((h + 11) % 12 + 1); // Convert 0-23 to 1-12
	return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export default function Calendar() {
	const [selectedDate, setSelectedDate] = useState(15);
	const [selectedMetric, setSelectedMetric] = useState("systolic"); // 'systolic', 'diastolic', 'average'
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [currentValue, setCurrentValue] = useState(null);
	const [selectedReading, setSelectedReading] = useState(null);
	const [highlightX, setHighlightX] = useState<number | null>(null);

	useEffect(() => {
		fetchBloodPressureData();
	}, []);

	const fetchBloodPressureData = () => {
		setLoading(true);
		fetch(`${Config.API_BASE_URL}/timeseries`)
			.then((res) => res.json())
			.then((timeseries) => {
				// Process data for chart
				const labels = timeseries.map((entry) => {
					const hhmm = entry.time.slice(0, 4); // e.g., "0810"
					const minutes = parseInt(hhmm.slice(2, 4), 10);
					return minutes % 10 === 0 ? formatHHMMSSTo12HourClock(entry.time) : "";
				});
				const systolic = timeseries.map((entry) => entry.data.systolic);
				const diastolic = timeseries.map((entry) => entry.data.diastolic);
				const average = timeseries.map((entry) => entry.data.average);

				// Get latest value for display
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
							color: () => "rgba(72, 61, 139, 1)", // darkslateblue
							strokeWidth: 2,
						},
						{
							data: diastolic,
							color: () => "rgba(100, 149, 237, 1)", // cornflowerblue
							strokeWidth: 2,
						},
						{
							data: average,
							color: () => "rgba(147, 112, 219, 1)", // mediumpurple
							strokeWidth: 2,
						},
					],
					legend: ["Systolic", "Diastolic", "Average"],
					labelIndexes: labels.map((label, i) => (label ? i : null)).filter(i => i !== null)
				});
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching data:", err);
				setLoading(false);
			});
	};

	const getDisplayValue = () => {
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
	};

	const getMetricColor = () => {
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
	};

	const chartConfig = {
		backgroundColor: "#ffffff",
		backgroundGradientFrom: "#f0f0f0",
		backgroundGradientTo: "#ffffff",
		decimalPlaces: 0,
		color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
		strokeWidth: 2,
		useShadowColorFromDataset: false,
		propsForDots: {
			r: "1",
			strokeWidth: "1",
			stroke: "#444",
		},
	};

	const weekDays = [
		{ day: "Sun", date: 14 },
		{ day: "Mon", date: 15 },
		{ day: "Tue", date: 16 },
		{ day: "Wed", date: 17 },
		{ day: "Thu", date: 18 },
		{ day: "Fri", date: 19 },
		{ day: "Sat", date: 20 },
	];

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.title}>Blood Pressure Monitoring</Text>
					<TouchableOpacity style={styles.calendarIcon}>
						<Ionicons name="calendar-outline" size={24} color="#3498db" />
					</TouchableOpacity>
				</View>

				{/* Month and Index Selector */}
				<View style={styles.selectorContainer}>
					<TouchableOpacity style={styles.monthSelector}>
						<Text style={styles.monthText}>March</Text>
						<Ionicons name="chevron-down" size={16} color="#2c3e50" />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.indexSelector}
						onPress={() => {
							// Cycle through metrics
							const metrics = ["systolic", "diastolic", "average"];
							const currentIndex = metrics.indexOf(selectedMetric);
							const nextIndex = (currentIndex + 1) % metrics.length;
							setSelectedMetric(metrics[nextIndex]);
						}}
					>
						<Text style={styles.indexText}>
							Indexes:{" "}
							{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
						</Text>
					</TouchableOpacity>
				</View>

				{/* Week Calendar */}
				<View style={styles.weekContainer}>
					{weekDays.map((item, index) => (
						<TouchableOpacity
							key={index}
							style={[
								styles.dayContainer,
								selectedDate === item.date && styles.selectedDay,
							]}
							onPress={() => setSelectedDate(item.date)}
						>
							<Text
								style={[
									styles.dayText,
									selectedDate === item.date && styles.selectedDayText,
								]}
							>
								{item.day}
							</Text>
							<Text
								style={[
									styles.dateText,
									selectedDate === item.date && styles.selectedDateText,
								]}
							>
								{item.date}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Blood Pressure Display */}
				{loading ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#3498db" />
						<Text style={styles.loadingText}>
							Loading blood pressure data...
						</Text>
					</View>
				) : (
					<View style={styles.heartRateContainer}>
						<View style={styles.heartIcon}>
							<Ionicons name="heart" size={40} color="#e74c3c" />
						</View>
						<Text style={[styles.heartRateValue, { color: getMetricColor() }]}>
							{getDisplayValue()}
						</Text>
						<Text style={[styles.heartRateUnit, { color: getMetricColor() }]}>
							mmHg
						</Text>
						<View style={styles.timestampContainer}>
							<Text style={styles.timestamp}>Today, 6:35 PM</Text>
						</View>

						{/* Metric Info */}
						<View style={styles.metricInfo}>
							<Text style={styles.metricDescription}>
								{selectedMetric === "systolic" &&
									"Systolic pressure (top number)"}
								{selectedMetric === "diastolic" &&
									"Diastolic pressure (bottom number)"}
								{selectedMetric === "average" && "Average blood pressure"}
							</Text>
						</View>
					</View>
				)}

				{/* Chart Section */}
				<View style={styles.chartSection}>
					<View style={styles.chartHeader}>
						<Text style={styles.chartTitle}>Blood Pressure Over Time</Text>
						<TouchableOpacity
							style={styles.refreshButton}
							onPress={fetchBloodPressureData}
						>
							<Ionicons name="refresh" size={20} color="#3498db" />
						</TouchableOpacity>
					</View>
					<Text style={styles.chartSubtitle}>Live data • Updated just now</Text>

					{loading ? (
						<View style={styles.chartLoadingContainer}>
							<ActivityIndicator size="large" color="#3498db" />
						</View>
					) : chartData ? (
						<View style={styles.chartContainer}>
							<LineChart
								data={chartData}
								width={screenWidth - 40}
								height={280}
								yAxisSuffix=" mmHg"
								yAxisInterval={10}
								chartConfig={chartConfig}
								style={styles.chart}
								withDots={false}
								withShadow={false}
								withInnerLines={true}
								withOuterLines={false}
								withVerticalLines={true}
								withHorizontalLines={true}
								segments={4}
								bezier
								onDataPointClick={({ index, x }) => {
									const systolic = chartData.datasets[0].data[index];
									const diastolic = chartData.datasets[1].data[index];
									const average = chartData.datasets[2].data[index];
									const label = chartData.labels[index];
									setSelectedReading({ systolic, diastolic, average, label });
									setHighlightX(x);
								}}
							/>
							{highlightX !== null && (
								<Svg
									style={{
										position: "absolute",
										top: 15,
										left: 20 + highlightX,
										height: 280,
										width: 1,
										zIndex: 1,
									}}
								>
									<Line
										x1="0"
										y1="0"
										x2="0"
										y2="280"
										stroke="red"
										strokeWidth="2"
										strokeDasharray="4"
									/>
								</Svg>
							)}
							{selectedReading && (
								<View style={{ marginTop: 10, alignItems: "center" }}>
									<Text style={{ fontSize: 16, fontWeight: "bold" }}>
										{selectedReading.label}
									</Text>
									<Text>Systolic: {selectedReading.systolic} mmHg</Text>
									<Text>Diastolic: {selectedReading.diastolic} mmHg</Text>
									<Text>Average: {selectedReading.average} mmHg</Text>
								</View>
							)}
							{/* Legend */}
							<View style={styles.legendContainer}>
								<View style={styles.legendItem}>
									<View
										style={[
											styles.legendDot,
											{ backgroundColor: "rgba(72, 61, 139, 1)" },
										]}
									/>
									<Text style={styles.legendText}>Systolic</Text>
								</View>
								<View style={styles.legendItem}>
									<View
										style={[
											styles.legendDot,
											{ backgroundColor: "rgba(100, 149, 237, 1)" },
										]}
									/>
									<Text style={styles.legendText}>Diastolic</Text>
								</View>
								<View style={styles.legendItem}>
									<View
										style={[
											styles.legendDot,
											{ backgroundColor: "rgba(147, 112, 219, 1)" },
										]}
									/>
									<Text style={styles.legendText}>Average</Text>
								</View>
							</View>
						</View>
					) : (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>Failed to load data</Text>
							<TouchableOpacity
								style={styles.retryButton}
								onPress={fetchBloodPressureData}
							>
								<Text style={styles.retryButtonText}>Retry</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "600",
		color: "#2c3e50",
	},
	calendarIcon: {
		padding: 5,
	},
	selectorContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	monthSelector: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#e1e8ed",
	},
	monthText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2c3e50",
		marginRight: 5,
	},
	indexSelector: {
		backgroundColor: "#ffffff",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#e1e8ed",
	},
	indexText: {
		fontSize: 14,
		color: "#7f8c8d",
		fontWeight: "500",
	},
	weekContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	dayContainer: {
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderRadius: 12,
		minWidth: 40,
	},
	selectedDay: {
		backgroundColor: "#3498db",
	},
	dayText: {
		fontSize: 12,
		color: "#7f8c8d",
		fontWeight: "500",
		marginBottom: 4,
	},
	selectedDayText: {
		color: "#ffffff",
	},
	dateText: {
		fontSize: 16,
		color: "#2c3e50",
		fontWeight: "600",
	},
	selectedDateText: {
		color: "#ffffff",
	},
	heartRateContainer: {
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	heartIcon: {
		marginBottom: 10,
	},
	heartRateValue: {
		fontSize: 64,
		fontWeight: "bold",
		color: "#3498db",
		marginBottom: 5,
	},
	heartRateUnit: {
		fontSize: 18,
		color: "#3498db",
		fontWeight: "500",
		marginBottom: 15,
	},
	timestampContainer: {
		backgroundColor: "#2ecc71",
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 15,
	},
	timestamp: {
		fontSize: 12,
		color: "#ffffff",
		fontWeight: "500",
	},
	chartSection: {
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	chartHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	},
	chartTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#2c3e50",
	},
	refreshButton: {
		padding: 5,
	},
	chartSubtitle: {
		fontSize: 14,
		color: "#7f8c8d",
		marginBottom: 20,
	},
	loadingContainer: {
		alignItems: "center",
		paddingVertical: 40,
	},
	loadingText: {
		marginTop: 10,
		fontSize: 14,
		color: "#7f8c8d",
	},
	chartLoadingContainer: {
		height: 280,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 15,
	},
	errorContainer: {
		height: 280,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 15,
	},
	errorText: {
		fontSize: 16,
		color: "#e74c3c",
		marginBottom: 10,
	},
	retryButton: {
		backgroundColor: "#3498db",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
	},
	retryButtonText: {
		color: "#ffffff",
		fontWeight: "600",
	},
	metricInfo: {
		marginTop: 10,
		paddingHorizontal: 20,
	},
	metricDescription: {
		fontSize: 12,
		color: "#7f8c8d",
		textAlign: "center",
		fontStyle: "italic",
	},
	legendContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 15,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: "#e1e8ed",
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 10,
	},
	legendDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 5,
	},
	legendText: {
		fontSize: 12,
		color: "#7f8c8d",
		fontWeight: "500",
	},
	chartContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 15,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
		position: "relative",
	},
	chart: {
		borderRadius: 10,
	},
});
