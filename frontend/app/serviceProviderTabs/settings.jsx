import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, TokenStore } from "../../lib/api";

export default function ProviderSettings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [providerProfile, setProviderProfile] = React.useState(null);

  // Fetch provider profile on component mount
  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeTokens();
      await fetchProviderProfile();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  const initializeTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (accessToken) {
        TokenStore.setTokens({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error("Error initializing tokens:", error);
    }
  };

  const fetchProviderProfile = async () => {
    try {
      setLoading(true);
      const profile = await api.providers.me();
      setProviderProfile(profile);
      setIsAvailable(profile?.availability || false);
    } catch (error) {
      console.error("Error fetching provider profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (available) => {
    try {
      setLoading(true);
      await api.providers.updateAvailability({ available });
      setIsAvailable(available);
      Alert.alert(
        "Success",
        `You are now ${available ? "available" : "unavailable"} for bookings`
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      Alert.alert("Error", "Failed to update availability. Please try again.");
      // Revert the switch if API call failed
      setIsAvailable(!available);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoggingOut(true);

            // Clear all storage and update login state
            await AsyncStorage.clear();
            await AsyncStorage.setItem("isLoggedIn", "false");

            // Navigate to the welcome screen with reset to prevent going back
            router.dismissAll();
            router.replace("/open");
          } catch (error) {
            console.error("Error during logout:", error);
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1d1664" />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="px-5 pt-12 flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold ml-3">
              Settings
            </Text>
          </View>
        </View>

        {/* Settings List */}
        <ScrollView className="flex-1 px-4">
          {loading && (
            <View className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center justify-center">
              <ActivityIndicator color="white" />
              <Text className="text-white ml-3">Loading profile...</Text>
            </View>
          )}

          {/* Provider Status Section */}
          <Text className="text-gray-200 mb-2 mt-4">Provider Status</Text>
          <View className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="business-outline" size={24} color="white" />
              <Text className="text-white ml-3">Available for bookings</Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={updateAvailability}
              trackColor={{ false: "#767577", true: "#00BCD4" }}
              thumbColor={isAvailable ? "#ffffff" : "#f4f3f4"}
              disabled={loading}
            />
          </View>

          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center">
            <Ionicons name="images-outline" size={24} color="white" />
            <Text className="text-white ml-3 flex-1">
              Portfolio & Documents
            </Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          {providerProfile && (
            <View className="bg-white/20 rounded-xl p-4 mb-3">
              <Text className="text-white font-semibold mb-2">
                Profile Summary
              </Text>
              <Text className="text-gray-200 text-sm">
                Rating: {providerProfile.rating || 0}/5 (
                {providerProfile.rating_count || 0} reviews)
              </Text>
              <Text className="text-gray-200 text-sm">
                Services: {providerProfile.services?.join(", ") || "None"}
              </Text>
              <Text className="text-gray-200 text-sm">
                Status:{" "}
                {providerProfile.approved ? "Approved" : "Pending Approval"}
              </Text>
            </View>
          )}

          {/* Account Section */}
          <Text className="text-gray-200 mb-2 mt-4">Account</Text>

          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center">
            <Ionicons name="key-outline" size={24} color="white" />
            <Text className="text-white ml-3 flex-1">Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          {/* Preferences Section */}
          <Text className="text-gray-200 mb-2 mt-4">Preferences</Text>
          <View className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Text className="text-white ml-3">Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#00EAFF" }}
              thumbColor={notificationsEnabled ? "#00EAFF" : "#f4f3f4"}
            />
          </View>

          <View className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="moon-outline" size={24} color="white" />
              <Text className="text-white ml-3">Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#00EAFF" }}
              thumbColor={darkMode ? "#00EAFF" : "#f4f3f4"}
            />
          </View>

          {/* Support Section */}
          <Text className="text-gray-200 mb-2 mt-4">Support</Text>
          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center">
            <Ionicons name="help-circle-outline" size={24} color="white" />
            <Text className="text-white ml-3 flex-1">Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3 flex-row items-center">
            <MaterialIcons name="policy" size={24} color="white" />
            <Text className="text-white ml-3 flex-1">Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            className="bg-red-500/80 rounded-xl p-4 mb-8 flex-row items-center justify-center"
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white ml-2 font-semibold">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
