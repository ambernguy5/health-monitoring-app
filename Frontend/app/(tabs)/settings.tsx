// app/(tabs)/settings.tsx
import { View, Text, StyleSheet } from "react-native";

export default function Settings() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Settings Screen</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
	},
});
