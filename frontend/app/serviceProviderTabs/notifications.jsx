import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProviderNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      // Dummy provider-specific notifications
      const dummyNotifications = [
        {
          id: 1,
          type: "booking",
          title: "New Booking Request",
          message: "You have a new booking request from Priya Sharma",
          timestamp: new Date(),
          read: false,
        },
        {
          id: 2,
          type: "schedule",
          title: "Schedule Updated",
          message: "Your availability has been updated for tomorrow",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: 3,
          type: "payment",
          title: "Payment Received",
          message: "₹1200 has been credited to your account",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 4,
          type: "job",
          title: "Job Completed",
          message: "You successfully completed booking #1220",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 5,
          type: "system",
          title: "Profile Verified",
          message: "Your profile has been verified by admin",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
        },
      ];
      setNotifications(dummyNotifications);
    } catch (error) {
      console.error("Failed to fetch provider notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return <Ionicons name="calendar" size={24} color="#00EAFF" />;
      case "schedule":
        return <FontAwesome5 name="calendar-check" size={22} color="#00EAFF" />;
      case "payment":
        return <Ionicons name="wallet" size={24} color="#00EAFF" />;
      case "job":
        return <MaterialIcons name="work-outline" size={24} color="#00EAFF" />;
      case "system":
        return <Ionicons name="information-circle" size={24} color="#00EAFF" />;
      default:
        return <Ionicons name="notifications" size={24} color="#00EAFF" />;
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
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
              Provider Notifications
            </Text>
          </View>
        </View>

        {/* Notification List */}
        <ScrollView
          className="flex-1 px-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                className={`bg-white/20 rounded-xl p-4 mb-3 flex-row items-start ${
                  !notification.read ? "border border-cyan-400" : ""
                }`}
              >
                <View className="mr-3 mt-1">
                  {getNotificationIcon(notification.type)}
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold">
                    {notification.title}
                  </Text>
                  <Text className="text-gray-200 mt-1">
                    {notification.message}
                  </Text>
                  <Text className="text-gray-300 text-sm mt-2">
                    {formatDate(notification.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="flex-1 justify-center items-center mt-10">
              <Ionicons name="notifications-off" size={48} color="white" />
              <Text className="text-white mt-4">
                No notifications for you yet
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
