import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api } from "../../lib/api"; // adjust path if needed

export default function BookingHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.bookings.list(); // ✅ backend endpoint
      setBookings(data || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Booking History</Text>
      </View>

      {/* Loading */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white mt-4">Loading your bookings...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="event-busy" size={50} color="white" />
          <Text className="text-white mt-4">No bookings found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {bookings.map((booking, idx) => (
            <TouchableOpacity
              key={idx}
              className="bg-white rounded-2xl p-4 mb-4 shadow-md"
              activeOpacity={0.8}
              onPress={() =>
                router.push(`/customerTabs/bookingHistory/${booking.id}`)
              }
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-800">
                  {booking.serviceName}
                </Text>
                <Text
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </Text>
              </View>
              <Text className="text-gray-600">
                Provider: {booking.providerName}
              </Text>
              <Text className="text-gray-600">Date: {booking.date}</Text>
              <Text className="text-gray-600">Amount: ₹{booking.amount}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}
