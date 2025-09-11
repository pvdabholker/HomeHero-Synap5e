import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "../../lib/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      // Simulated notifications of different types
      const dummyNotifications = [
        {
          id: 1,
          type: "booking",
          title: "New Booking Confirmed",
          message:
            "Your booking with John (Plumber) has been confirmed for tomorrow at 2:00 PM",
          timestamp: new Date(),
          read: false,
        },
        {
          id: 2,
          type: "service",
          title: "Service Started",
          message: "Your service provider has started the work",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: false,
        },
        {
          id: 3,
          type: "booking",
          title: "Booking Reminder",
          message:
            "Reminder: You have a booking with Mike (Electrician) tomorrow",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 4,
          type: "service",
          title: "Service Completed",
          message:
            "Your service has been completed. Please rate your experience",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 5,
          type: "system",
          title: "Payment Successful",
          message: "Payment of ₹500 has been processed successfully",
          timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 6,
          type: "booking",
          title: "Booking Canceled",
          message: "Your booking for Cleaning Service has been canceled",
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          read: true,
        },
        {
          id: 7,
          type: "system",
          title: "Profile Updated",
          message: "Your profile information has been updated successfully",
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
          read: true,
        },
      ];
      setNotifications(dummyNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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
      case "service":
        return (
          <MaterialIcons name="home-repair-service" size={24} color="#00EAFF" />
        );
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
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-5 pt-12 flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold ml-3">
            Notifications
          </Text>
        </View>
      </View>

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
            <Text className="text-white mt-4">No notifications yet</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
