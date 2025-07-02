import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GraphDropdownSelector({ selectedGraph, setSelectedGraph }) {
	const [modalVisible, setModalVisible] = useState(false);

	const options = ["bloodPressure", "heartRate"];

	return (
		<View style={styles.selectorContainer}>
			<TouchableOpacity
				style={styles.dropdownButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.dropdownText}>
					{selectedGraph === "bloodPressure" ? "Blood Pressure" : "Heart Rate"}
				</Text>
				<Ionicons name="chevron-down" size={16} color="#2c3e50" />
			</TouchableOpacity>

			<Modal
				transparent
				visible={modalVisible}
				animationType="fade"
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					style={styles.modalOverlay}
					activeOpacity={1}
					onPressOut={() => setModalVisible(false)}
				>
					<View style={styles.modalContent}>
						{options.map((option) => (
							<TouchableOpacity
								key={option}
								style={styles.modalItem}
								onPress={() => {
									setSelectedGraph(option);
									setModalVisible(false);
								}}
							>
								<Text style={styles.modalText}>
									{option === "bloodPressure" ? "Blood Pressure" : "Heart Rate"}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</TouchableOpacity>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	selectorContainer: {
		alignItems: "center",
		marginVertical: 10,
	},
	dropdownButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
	},
	dropdownText: {
		marginRight: 8,
		fontSize: 16,
		color: "#2c3e50",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 8,
		padding: 15,
		minWidth: 200,
	},
	modalItem: {
		paddingVertical: 10,
	},
	modalText: {
		fontSize: 16,
		color: "#333",
	},
});