import { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

      if (token && isLoggedIn === "true") {
        router.replace("/customerTabs/Home");
      } else {
        router.replace("/auth/OpeningPage");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      router.replace("/auth/OpeningPage");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <View />; // Loading screen
  }

  return null;
}
