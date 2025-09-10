import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function Dashboard() {
  // State variables for dynamic data
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProviders, setTotalProviders] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  // Simulate API call on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          usersResponse,
          providersResponse,
          bookingsResponse,
          approvalsResponse,
        ] = await Promise.all([
          fetch("http://localhost:3001/api/admin/total-users"),
          fetch("http://localhost:3001/api/admin/total-providers"),
          fetch("http://localhost:3001/api/admin/active-bookings"),
          fetch("http://localhost:3001/api/admin/pending-approvals"),
        ]);

        const users = await usersResponse.json();
        const providers = await providersResponse.json();
        const bookings = await bookingsResponse.json();
        const approvals = await approvalsResponse.json();

        setTotalUsers(users.count || 0);
        setTotalProviders(providers.count || 0);
        setActiveBookings(bookings.count || 0);
        setPendingApprovals(approvals.count || 0);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        Alert.alert("Error", "Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  // Quick link actions
  const handleQuickLink = (action) => {
    Alert.alert("Action Triggered", `You clicked on ${action}`);
    // Later integrate navigation or backend action
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 flex-row justify-between items-center">
          <Ionicons name="menu" size={28} color="white" />
          <View className="flex-row items-center m-1">
            <Ionicons name="person-circle-outline" size={30} color="white" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-white text-2xl font-semibold px-5 mt-4">
          Dashboard
        </Text>

        {/* Overview Section */}
        <View className="px-4 mt-6">
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
                <FontAwesome5 name="calendar-check" size={24} color="#1d1664" />
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
        </View>

        {/* Quick Links */}
        <View className="px-4 mt-6 mb-8">
          <Text className="text-lg font-semibold text-white">Quick Links</Text>
          <View className="flex-row flex-wrap mt-4 justify-between">
            {[
              "Add new Provider",
              "Review Bookings",
              "Send Announcements",
              "View Reports",
            ].map((link, index) => (
              <TouchableOpacity
                key={index}
                className="w-full bg-white rounded-xl p-4 mb-4 shadow-md"
                onPress={() => handleQuickLink(link)}
              >
                <Text className="text-gray-700 font-medium">{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
