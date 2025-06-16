// app/login.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		// Add your login logic here
		router.replace("/(tabs)/home");
	};

	const handleForgotPassword = () => {
		// Add forgot password logic
		console.log("Forgot password pressed");
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

			{/* Logo and Brain Icon */}
			<View style={styles.logoContainer}>
				<View style={styles.brainIconContainer}>
					<LinearGradient
						colors={["#667eea", "#764ba2"]}
						style={styles.brainGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						{/* Brain circuit pattern */}
						<View style={styles.brainPattern}>
							<View style={[styles.dot, styles.dot1]} />
							<View style={[styles.dot, styles.dot2]} />
							<View style={[styles.dot, styles.dot3]} />
							<View style={[styles.dot, styles.dot4]} />
							<View style={[styles.dot, styles.dot5]} />
							<View style={[styles.line, styles.line1]} />
							<View style={[styles.line, styles.line2]} />
							<View style={[styles.line, styles.line3]} />
						</View>
					</LinearGradient>
				</View>

				<Text style={styles.appName}>Health eTile</Text>
			</View>

			{/* Sign In Form */}
			<View style={styles.formContainer}>
				<Text style={styles.signInTitle}>Sign in</Text>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Username:</Text>
					<TextInput
						style={styles.input}
						value={username}
						onChangeText={setUsername}
						placeholder=""
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.inputLabel}>Password:</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						placeholder=""
						secureTextEntry
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>

				{/* Buttons */}
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.forgotButton}
						onPress={handleForgotPassword}
					>
						<Text style={styles.forgotButtonText}>Forgot password</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
						<Text style={styles.signInButtonText}>Sign In</Text>
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		paddingHorizontal: 30,
	},
	logoContainer: {
		alignItems: "center",
		marginTop: 80,
		marginBottom: 60,
	},
	brainIconContainer: {
		width: 120,
		height: 120,
		marginBottom: 20,
	},
	brainGradient: {
		width: "100%",
		height: "100%",
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	brainPattern: {
		width: 80,
		height: 60,
		position: "relative",
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: "white",
		position: "absolute",
	},
	dot1: { top: 10, left: 15 },
	dot2: { top: 5, right: 20 },
	dot3: { top: 25, left: 25 },
	dot4: { bottom: 15, left: 10 },
	dot5: { bottom: 10, right: 15 },
	line: {
		backgroundColor: "white",
		position: "absolute",
		borderRadius: 1,
	},
	line1: {
		width: 20,
		height: 2,
		top: 15,
		left: 20,
		transform: [{ rotate: "45deg" }],
	},
	line2: {
		width: 15,
		height: 2,
		top: 30,
		left: 30,
		transform: [{ rotate: "-30deg" }],
	},
	line3: {
		width: 18,
		height: 2,
		bottom: 20,
		left: 20,
		transform: [{ rotate: "30deg" }],
	},
	appName: {
		fontSize: 24,
		fontWeight: "600",
		color: "#2c3e50",
		letterSpacing: 0.5,
	},
	formContainer: {
		flex: 1,
	},
	signInTitle: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2c3e50",
		marginBottom: 40,
	},
	inputContainer: {
		marginBottom: 25,
	},
	inputLabel: {
		fontSize: 16,
		color: "#7f8c8d",
		marginBottom: 8,
		fontWeight: "500",
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: "#bdc3c7",
		paddingVertical: 10,
		paddingHorizontal: 0,
		fontSize: 16,
		color: "#2c3e50",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 40,
	},
	forgotButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "#3498db",
	},
	forgotButtonText: {
		color: "#3498db",
		fontSize: 16,
		fontWeight: "500",
	},
	signInButton: {
		backgroundColor: "#3498db",
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 25,
	},
	signInButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
