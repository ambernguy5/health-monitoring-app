// app/(tabs)/home.tsx
import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function Home() {
	// Sample data for the pedometer chart
	const chartData = {
		labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		datasets: [
			{
				data: [800, 2100, 1200, 1800, 2300, 1500, 900],
			},
		],
	};

	const chartConfig = {
		backgroundColor: "#ffffff",
		backgroundGradientFrom: "#ffffff",
		backgroundGradientTo: "#ffffff",
		color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
		strokeWidth: 2,
		barPercentage: 0.7,
		useShadowColorFromDataset: false,
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

			<ScrollView showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<View style={styles.userInfo}>
						<View style={styles.avatar}>
							<Ionicons name="person" size={24} color="#3498db" />
						</View>
						<View>
							<Text style={styles.healthMonitor}>Health monitor</Text>
							<Text style={styles.userName}>Jade West</Text>
						</View>
					</View>
					<View style={styles.headerIcons}>
						<TouchableOpacity style={styles.iconButton}>
							<Ionicons name="heart-outline" size={24} color="#2c3e50" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.iconButton}>
							<Ionicons name="menu" size={24} color="#2c3e50" />
						</TouchableOpacity>
					</View>
				</View>

				{/* Indexes Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Indexes</Text>
						<TouchableOpacity style={styles.dropdown}>
							<Text style={styles.dropdownText}>Current</Text>
							<Ionicons name="chevron-down" size={16} color="#7f8c8d" />
						</TouchableOpacity>
					</View>

					<View style={styles.indexGrid}>
						{/* Pulse */}
						<View style={styles.indexCard}>
							<View style={styles.indexHeader}>
								<Text style={styles.indexLabel}>Pulse</Text>
								<Ionicons name="pulse" size={20} color="#2c3e50" />
							</View>
							<Text style={styles.indexValue}>82</Text>
							<Text style={styles.indexUnit}>BPM</Text>
						</View>

						{/* Activities */}
						<View style={styles.indexCard}>
							<View style={styles.indexHeader}>
								<Text style={styles.indexLabel}>Activities</Text>
								<Ionicons name="walk" size={20} color="#2c3e50" />
							</View>
							<Text style={styles.indexValue}>1.2K</Text>
							<Text style={styles.indexUnit}>steps</Text>
						</View>

						{/* Water */}
						<View style={styles.indexCard}>
							<View style={styles.indexHeader}>
								<Text style={styles.indexLabel}>Water</Text>
								<Ionicons name="water" size={20} color="#2c3e50" />
							</View>
							<Text style={styles.indexValue}>0.8</Text>
							<Text style={styles.indexUnit}>liters</Text>
						</View>

						{/* Calories */}
						<View style={styles.indexCard}>
							<View style={styles.indexHeader}>
								<Text style={styles.indexLabel}>Calories</Text>
								<Ionicons name="flame" size={20} color="#2c3e50" />
							</View>
							<Text style={styles.indexValue}>35</Text>
							<Text style={styles.indexUnit}>kcal</Text>
						</View>
					</View>
				</View>

				{/* Pedometer Section */}
				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Pedometer</Text>
						<TouchableOpacity style={styles.dropdown}>
							<Text style={styles.dropdownText}>Past Week</Text>
							<Ionicons name="chevron-down" size={16} color="#7f8c8d" />
						</TouchableOpacity>
					</View>

					<View style={styles.chartContainer}>
						<BarChart
							data={chartData}
							width={screenWidth - 60}
							height={200}
							chartConfig={chartConfig}
							style={styles.chart}
							showValuesOnTopOfBars={false}
							withInnerLines={false}
						/>
					</View>
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
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#e3f2fd",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 12,
	},
	healthMonitor: {
		fontSize: 14,
		color: "#7f8c8d",
		fontWeight: "500",
	},
	userName: {
		fontSize: 16,
		color: "#2c3e50",
		fontWeight: "600",
	},
	headerIcons: {
		flexDirection: "row",
	},
	iconButton: {
		marginLeft: 15,
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "600",
		color: "#2c3e50",
	},
	dropdown: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#ffffff",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15,
		borderWidth: 1,
		borderColor: "#e1e8ed",
	},
	dropdownText: {
		fontSize: 14,
		color: "#7f8c8d",
		marginRight: 5,
	},
	indexGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	indexCard: {
		width: "48%",
		backgroundColor: "#ffffff",
		borderRadius: 15,
		padding: 16,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	indexHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	indexLabel: {
		fontSize: 14,
		color: "#7f8c8d",
		fontWeight: "500",
	},
	indexValue: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2c3e50",
		marginBottom: 2,
	},
	indexUnit: {
		fontSize: 14,
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
	},
	chart: {
		borderRadius: 10,
	},
});
