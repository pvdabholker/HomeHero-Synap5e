import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";

export default function Dashboard() {
  // State variables for dynamic data
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => setShowDropdown(false),
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear stored authentication data
            await AsyncStorage.multiRemove([
              "access_token",
              "token_type",
              "userType",
              "userName",
              "userEmail",
              "userId",
              "isLoggedIn",
            ]);

            // Clear API token store
            const { TokenStore } = await import("../../lib/api");
            TokenStore.clear();

            setShowDropdown(false);

            // Navigate to admin login
            router.dismissAll();
            router.replace("../auth/AdminLogin");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  // Check authentication and load data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Ensure token is available
        const token = await AsyncStorage.getItem("access_token");
        if (token && !api.getToken()) {
          const { TokenStore } = await import("../../lib/api");
          TokenStore.setTokens({ access_token: token });
        }

        // Fetch data from backend
        const [usersResponse, providersResponse, bookingsResponse] =
          await Promise.all([
            api.admin.getUsers(),
            api.admin.getProviders(),
            api.admin.getBookings(),
          ]);

        // Count total users, providers, and active bookings
        setTotalUsers(usersResponse?.length || 0);
        setTotalProviders(providersResponse?.length || 0);
        setActiveBookings(bookingsResponse?.length || 0);

        // Count pending providers (status = 'pending')
        const pendingProviders =
          providersResponse?.filter(
            (provider) => provider.status === "pending"
          ) || [];
        setPendingApprovals(pendingProviders.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        Alert.alert(
          "Error",
          "Failed to load dashboard data. Please ensure you're logged in as an admin and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Quick link actions
  const handleQuickLink = (action) => {
    switch (action) {
      case "Add new Provider":
        router.push("./pages/AddNewProvider");
        break;
      case "Review Bookings":
        router.push("./pages/ReviewBookings");
        break;
      case "Send Announcements":
        router.push("./pages/SendAnnouncements");
        break;
      case "View Reports":
        router.push("./pages/ViewReports");
        break;
      case "Manage Users":
        router.push("./pages/ManageUsers");
        break;
      case "System Settings":
        router.push("./pages/SystemSettings");
        break;
      case "Generate Reports":
        router.push("./pages/GenerateReports");
        break;
      case "View Analytics":
        router.push("./pages/ViewAnalytics");
        break;
      default:
        Alert.alert("Action Triggered", `You clicked on ${action}`);
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1" style={{ overflow: "visible" }}>
        {/* Header */}
        <View className="px-5 pt-6 flex-row justify-between items-center relative z-50">
          <Ionicons name="menu" size={28} color="white" />
          <View className="flex-row items-center m-1 relative">
            <TouchableOpacity onPress={toggleDropdown}>
              <Ionicons name="person-circle-outline" size={30} color="white" />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showDropdown && (
              <View
                className="absolute bg-white rounded-lg shadow-lg py-2 px-4 z-50"
                style={{
                  top: 40,
                  right: -10,
                  minWidth: 120,
                  elevation: 10, // Android shadow
                  shadowColor: "#000", // iOS shadow
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                }}
              >
                <TouchableOpacity
                  onPress={handleLogout}
                  className="py-3 px-2 flex-row items-center"
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text className="ml-2 text-gray-700 font-medium">Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Title */}
        <Text className="text-white text-2xl font-semibold px-5">
          Dashboard
        </Text>

        {/* Overview Section */}
        <View className="px-4 mt-2">
          {loading ? (
            <View className="bg-white rounded-2xl p-6 items-center justify-center">
              <ActivityIndicator size="large" color="#1d1664" />
              <Text className="text-gray-600 mt-4 text-center">
                Loading dashboard data...
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-lg font-semibold text-white">Overview</Text>
              <View className="flex-row flex-wrap mt-4 justify-between">
                <View className="w-[45%] bg-white rounded-xl shadow-md p-4 mb-4 items-center">
                  <View className="w-14 h-14 rounded-lg bg-gray-100 items-center justify-center">
                    <Ionicons name="people" size={28} color="#1d1664" />
                  </View>
                  <Text className="mt-3 text-base font-medium text-gray-700">
                    Total Users
                  </Text>
                  <Text className="text-gray-500">{totalUsers}</Text>
                </View>

                <View className="w-[45%] bg-white rounded-xl shadow-md p-4 mb-4 items-center">
                  <View className="w-14 h-14 rounded-lg bg-gray-100 items-center justify-center">
                    <MaterialCommunityIcons
                      name="account-group"
                      size={28}
                      color="#1d1664"
                    />
                  </View>
                  <Text className="mt-3 text-base font-medium text-gray-700">
                    Total Providers
                  </Text>
                  <Text className="text-gray-500">{totalProviders}</Text>
                </View>

                <View className="w-[45%] bg-white rounded-xl shadow-md p-4 mb-4 items-center">
                  <View className="w-14 h-14 rounded-lg bg-gray-100 items-center justify-center">
                    <FontAwesome5
                      name="calendar-check"
                      size={24}
                      color="#1d1664"
                    />
                  </View>
                  <Text className="mt-3 text-base font-medium text-gray-700">
                    Active Bookings
                  </Text>
                  <Text className="text-gray-500">{activeBookings}</Text>
                </View>

                <View className="w-[45%] bg-white rounded-xl shadow-md p-4 mb-4 items-center">
                  <View className="w-14 h-14 rounded-lg bg-gray-100 items-center justify-center">
                    <Ionicons name="time" size={28} color="#1d1664" />
                  </View>
                  <Text className="mt-3 text-base font-medium text-gray-700">
                    Pending Approvals
                  </Text>
                  <Text className="text-gray-500">{pendingApprovals}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Quick Links */}
        <View className="px-4 mt-2 mb-8 flex-1">
          <Text className="text-lg font-semibold text-white">Quick Links</Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mt-4 flex-1"
          >
            {[
              "Add new Provider",
              "Review Bookings",
              "Send Announcements",
              "View Reports",
              "Manage Users",
              "System Settings",
              "Generate Reports",
              "View Analytics",
            ].map((link, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-4 shadow-md w-full"
                onPress={() => handleQuickLink(link)}
              >
                <Text className="text-gray-700 font-medium">{link}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
}
