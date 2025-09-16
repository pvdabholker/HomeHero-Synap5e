import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";
import { api, TokenStore } from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ServiceProviderHome() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    pendingBookings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    rating: 0,
    isAvailable: true,
  });
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // First initialize tokens
      await initializeTokens();

      // Then load data that requires authentication
      await loadDashboardData();
      await loadUserName();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  const initializeTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      console.log("Token initialization:", {
        hasAccessToken: !!accessToken,
        tokenLength: accessToken?.length || 0,
        tokenPreview: accessToken?.substring(0, 20) + "..." || "none",
      });

      if (accessToken) {
        TokenStore.setTokens({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        console.log("Tokens set in TokenStore successfully");
      } else {
        console.log("No access token found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error initializing tokens:", error);
    }
  };
  const loadUserName = async () => {
    try {
      const storedUserName = await AsyncStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // First test basic authentication
      console.log("Testing authentication with users/me...");
      const userProfile = await api.users.me();
      console.log("User profile loaded:", userProfile);

      // Check if user is a provider
      if (userProfile?.user_type !== "provider") {
        throw new Error("Access denied: User is not a service provider");
      }

      // Load provider profile
      console.log("Loading provider profile...");
      const profile = await api.providers.me();
      console.log("Provider profile loaded:", profile);
      setProviderProfile(profile);

      // Load bookings
      console.log("Loading bookings...");
      let bookings = [];
      try {
        bookings = await api.bookings.my();
        console.log("Bookings loaded:", bookings);
      } catch (bookingError) {
        console.error(
          "Failed to load bookings with my-bookings endpoint:",
          bookingError
        );

        // Try alternative endpoint for pending bookings
        try {
          console.log("Trying pending bookings endpoint...");
          const pendingBookings = await api.bookings.pending();
          console.log("Pending bookings loaded:", pendingBookings);
          bookings = pendingBookings || [];
        } catch (pendingError) {
          console.error("Failed to load pending bookings:", pendingError);
          console.log("Continuing with empty bookings array");
          bookings = [];
        }
      }

      // Calculate dashboard metrics
      const pendingBookings =
        bookings?.filter((b) => b.status === "pending")?.length || 0;
      const totalBookings = bookings?.length || 0;
      const completedBookings =
        bookings?.filter((b) => b.status === "completed") || [];
      const totalEarnings = completedBookings.reduce(
        (sum, booking) =>
          sum + (booking.final_price || booking.estimated_price || 0),
        0
      );

      setDashboardData({
        pendingBookings,
        totalBookings,
        totalEarnings,
        rating: profile?.rating || 0,
        isAvailable: profile?.availability || false,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);

      // Check for specific error types
      if (
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        Alert.alert(
          "Authentication Error",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () =>
                router.push("/auth/serviceProvider/serviceProviderLogin"),
            },
          ]
        );
      } else if (error.message.includes("Access denied")) {
        Alert.alert("Access Denied", error.message);
      } else {
        Alert.alert(
          "Error",
          `Failed to load dashboard data: ${error.message}. Please check your internet connection and try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !dashboardData.isAvailable;
      await api.providers.updateAvailability({ available: newStatus });

      setDashboardData((prev) => ({ ...prev, isAvailable: newStatus }));
      Alert.alert(
        "Status Updated",
        `You are now ${newStatus ? "available" : "unavailable"} for new bookings`
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      Alert.alert("Error", "Failed to update availability status.");
    }
  };

  const handleItemPress = (itemId) => {
    switch (itemId) {
      case 1:
        router.push("/serviceProviderTabs/bookings");
        break;
      case 2:
        // Navigate to contact customer page
        break;
      case 3:
        router.push("/serviceProviderTabs/notifications");
        break;
      case 4:
        // Navigate to availability page
        break;
      case 5:
        // Navigate to job completion page
        break;
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Booking Request",
      subtitle: "View and manage your booking",
      icon: <MaterialIcons name="event-note" size={22} color="#333" />,
    },
    {
      id: 2,
      title: "Contact Customer",
      subtitle: "Call or email your customer",
      icon: <Ionicons name="person-outline" size={22} color="#333" />,
    },
    {
      id: 3,
      title: "Notifications",
      subtitle: "Read recent updates",
      icon: <Ionicons name="notifications-outline" size={22} color="#333" />,
    },
    {
      id: 4,
      title: "Availability",
      subtitle: "See your schedule",
      icon: <FontAwesome5 name="calendar-check" size={20} color="#333" />,
    },
    {
      id: 5,
      title: "Job Completion",
      subtitle: "Finalized completed jobs",
      icon: <Feather name="check-square" size={20} color="#333" />,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1d1664" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1d1664"
        translucent={false}
      />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center px-5 py-4 mt-2">
          <Ionicons name="home" size={26} color="white" />
          <Text className="text-xl font-bold text-cyan-400">HomeHero</Text>
          <TouchableOpacity
            onPress={() => router.push("/serviceProviderTabs/profile")}
            className="flex-row items-center bg-white/20 rounded-full px-3 py-2 border border-white/30"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="person-circle-outline" size={24} color="white" />
            <Text className="text-white text-sm ml-1 font-medium">Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View className="px-5 mb-4">
          <Text className="text-white text-lg">
            Welcome back, {userName || providerProfile?.name || "Provider"}!
          </Text>
          <Text className="text-gray-200 text-sm">
            Here's your business overview
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-4">Loading dashboard...</Text>
          </View>
        ) : (
          <>
            {/* Dashboard Stats */}
            <View className="px-5 mb-6">
              <View className="flex-row justify-between mb-4">
                <View className="bg-white/20 rounded-xl p-4 flex-1 mr-2">
                  <Text className="text-cyan-400 text-sm font-medium">
                    Pending
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {dashboardData.pendingBookings}
                  </Text>
                  <Text className="text-gray-200 text-xs">New requests</Text>
                </View>
                <View className="bg-white/20 rounded-xl p-4 flex-1 ml-2">
                  <Text className="text-green-400 text-sm font-medium">
                    Total Jobs
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {dashboardData.totalBookings}
                  </Text>
                  <Text className="text-gray-200 text-xs">All time</Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <View className="bg-white/20 rounded-xl p-4 flex-1 mr-2">
                  <Text className="text-yellow-400 text-sm font-medium">
                    Rating
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    {dashboardData.rating.toFixed(1)}
                  </Text>
                  <Text className="text-gray-200 text-xs">Out of 5.0</Text>
                </View>
                <View className="bg-white/20 rounded-xl p-4 flex-1 ml-2">
                  <Text className="text-purple-400 text-sm font-medium">
                    Earnings
                  </Text>
                  <Text className="text-white text-2xl font-bold">
                    ₹{dashboardData.totalEarnings}
                  </Text>
                  <Text className="text-gray-200 text-xs">Total earned</Text>
                </View>
              </View>
            </View>

            {/* Availability Toggle */}
            <View className="px-5 mb-6">
              <TouchableOpacity
                onPress={toggleAvailability}
                className={`rounded-xl p-4 flex-row items-center justify-between ${
                  dashboardData.isAvailable
                    ? "bg-green-500/30"
                    : "bg-red-500/30"
                }`}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      dashboardData.isAvailable
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={24}
                    color={dashboardData.isAvailable ? "#10B981" : "#EF4444"}
                  />
                  <Text className="text-white ml-3 font-medium">
                    {dashboardData.isAvailable
                      ? "Available for bookings"
                      : "Currently unavailable"}
                  </Text>
                </View>
                <Text className="text-cyan-400 font-medium">Toggle</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Menu Items */}
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadDashboardData}
              colors={["#06b6d4"]} // cyan-500
              tintColor="#06b6d4"
              title="Pull to refresh"
              titleColor="#ffffff"
            />
          }
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-lg px-4 py-3 flex-row items-center justify-between mb-3 shadow-sm"
              activeOpacity={0.7}
              onPress={() => handleItemPress(item.id)}
            >
              <View className="flex-row items-center space-x-3">
                {item.icon}
                <View>
                  <Text className="text-base font-semibold text-black">
                    {item.title}
                  </Text>
                  <Text className="text-gray-500 text-xs">{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#333" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
