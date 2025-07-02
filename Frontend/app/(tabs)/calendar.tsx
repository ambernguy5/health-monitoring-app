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
import BloodPressureGraph from "../graphs/bloodPressureGraph";
import { formatHHMMSSTo12HourClock } from '../utils/formatters';
import { fetchBloodPressureDataAndProcess, getDisplayValue, getMetricColor} from "../utils/bloodPressureUtils";
import HeartRateGraph from "../graphs/heartRateGraph";
import GraphDropdownSelector from "../utils/graphSelector";


const screenWidth = Dimensions.get("window").width;

export default function Calendar() {
	const [selectedDate, setSelectedDate] = useState(15);
	const [selectedMetric, setSelectedMetric] = useState("systolic"); // 'systolic', 'diastolic', 'average'
	const [chartData, setChartData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [currentValue, setCurrentValue] = useState(null);
	const [selectedReading, setSelectedReading] = useState(null);
	const [highlightX, setHighlightX] = useState<number | null>(null);
	const [selectedGraph, setSelectedGraph] = useState<'bloodPressure' | 'heartRate'>('bloodPressure');

	
	useEffect(() => {
		fetchBloodPressureDataAndProcess(setChartData, setCurrentValue, setLoading, Config.API_BASE_URL);
	}, []);
	
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
							const metrics = ["systolic", "diastolic", "average"];
							const currentIndex = metrics.indexOf(selectedMetric);
							const nextIndex = (currentIndex + 1) % metrics.length;
							setSelectedMetric(metrics[nextIndex]);
						}}
					>
						<Text style={styles.indexText}>
							Indexes: {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
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
						<Text style={styles.loadingText}>Loading blood pressure data...</Text>
					</View>
				) : (
					<View style={styles.heartRateContainer}>
						<View style={styles.heartIcon}>
							<Ionicons name="heart" size={40} color="#e74c3c" />
						</View>
						<Text style={[styles.heartRateValue, { color: getMetricColor(selectedMetric) }]}>
							{getDisplayValue(currentValue, selectedMetric)}
						</Text>
						<Text style={[styles.heartRateUnit, { color: getMetricColor(selectedMetric) }]}>
							mmHg
						</Text>
						<View style={styles.timestampContainer}>
							<Text style={styles.timestamp}>Today, 6:35 PM</Text>
						</View>
						<View style={styles.metricInfo}>
							<Text style={styles.metricDescription}>
								{selectedMetric === "systolic" && "Systolic pressure (top number)"}
								{selectedMetric === "diastolic" && "Diastolic pressure (bottom number)"}
								{selectedMetric === "average" && "Average blood pressure"}
							</Text>
						</View>
					</View>
				)}

				{/* Graph Selector */}
				<GraphDropdownSelector
					selectedGraph={selectedGraph}
					setSelectedGraph={setSelectedGraph}
				/>

				{/* Chart Section */}
				<View style={styles.chartSection}>
					<View style={styles.chartHeader}>
						<Text style={styles.chartTitle}>
							{selectedGraph === "bloodPressure"
								? "Blood Pressure Over Time"
								: selectedGraph === "heartRate"
									? "Heart Rate Over Time"
									: "Graph"}
						</Text>
						{selectedGraph === "bloodPressure" && (
							<TouchableOpacity
								style={styles.refreshButton}
								onPress={() =>
									fetchBloodPressureDataAndProcess(
										setChartData,
										setCurrentValue,
										setLoading,
										Config.API_BASE_URL
									)
								}
							>
								<Ionicons name="refresh" size={20} color="#3498db" />
							</TouchableOpacity>
						)}
					</View>

					<Text style={styles.chartSubtitle}>Live data • Updated just now</Text>

					{loading ? (
						<View style={styles.chartLoadingContainer}>
							<ActivityIndicator size="large" color="#3498db" />
						</View>
					) : selectedGraph === "bloodPressure" ? (
						<BloodPressureGraph
							chartData={chartData}
							screenWidth={screenWidth}
							chartConfig={chartConfig}
							loading={loading}
							selectedReading={selectedReading}
							highlightX={highlightX}
							onDataPointClick={({ index, x }) => {
								const systolic = chartData.datasets[0].data[index];
								const diastolic = chartData.datasets[1].data[index];
								const average = chartData.datasets[2].data[index];
								const label = chartData.labels[index];
								setSelectedReading({ systolic, diastolic, average, label });
								setHighlightX(x);
							}}
						/>
					) : selectedGraph === "heartRate" ? (
						<HeartRateGraph />
					) : (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>Failed to load data</Text>
							<TouchableOpacity
								style={styles.retryButton}
								onPress={() =>
									fetchBloodPressureDataAndProcess(
										setChartData,
										setCurrentValue,
										setLoading,
										Config.API_BASE_URL
									)
								}
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
