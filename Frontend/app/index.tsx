import { useEffect, useState } from "react";
import { router } from "expo-router";
import { View, Text } from "react-native";

export default function Index() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check auth state (could be from AsyncStorage, etc.)
		const checkAuthState = async () => {
			// Simulate checking stored auth state
			// const storedAuth = await AsyncStorage.getItem('isLoggedIn');
			// setIsLoggedIn(storedAuth === 'true');

			setIsLoading(false);
		};

		checkAuthState();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (isLoggedIn) {
				router.replace("/(tabs)/home");
			} else {
				router.replace("/login");
			}
		}
	}, [isLoggedIn, isLoading]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Loading...</Text>
			</View>
		);
	}

	return null;
}
