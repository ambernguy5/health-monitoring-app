// hooks/useAuth.tsx
import { useState } from "react";

export const useAuth = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return {
		isLoggedIn,
		setIsLoggedIn,
	};
};
