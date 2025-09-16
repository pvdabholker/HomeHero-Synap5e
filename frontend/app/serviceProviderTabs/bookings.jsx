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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, TokenStore } from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookingRequests({ navigation }) {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider bookings from backend
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeTokens();
      await fetchProviderBookings();
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

  const fetchProviderBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.bookings.my();
      setBookings(response || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await api.bookings.respond(bookingId, {
        status: "accepted",
      });

      Alert.alert("Success", "Booking accepted successfully!");

      // Refresh the bookings list
      fetchProviderBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
      Alert.alert("Error", "Failed to accept booking. Please try again.");
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await api.bookings.respond(bookingId, {
        status: "declined",
      });

      Alert.alert("Success", "Booking declined successfully!");

      // Refresh the bookings list
      fetchProviderBookings();
    } catch (error) {
      console.error("Error declining booking:", error);
      Alert.alert("Error", "Failed to decline booking. Please try again.");
    }
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
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white ml-3">
            Booking Requests
          </Text>
        </View>

        {/* Booking List */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-4">Loading bookings...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Ionicons name="alert-circle-outline" size={64} color="white" />
            <Text className="text-white text-center mt-4 mb-4">{error}</Text>
            <TouchableOpacity
              onPress={fetchProviderBookings}
              className="bg-cyan-400 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : bookings.length === 0 ? (
          <View className="flex-1 justify-center items-center px-4">
            <Ionicons name="calendar-outline" size={64} color="white" />
            <Text className="text-white text-center mt-4 text-lg">
              No booking requests yet
            </Text>
            <Text className="text-white/80 text-center mt-2">
              New booking requests will appear here
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {bookings.map((booking) => (
              <View
                key={booking.booking_id}
                className="bg-white rounded-lg p-4 mb-4 shadow-sm"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-semibold">
                    Booking #{booking.booking_id?.slice(0, 8)}
                  </Text>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      booking.status === "pending"
                        ? "bg-yellow-100"
                        : booking.status === "accepted"
                          ? "bg-green-100"
                          : booking.status === "declined"
                            ? "bg-red-100"
                            : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        booking.status === "pending"
                          ? "text-yellow-800"
                          : booking.status === "accepted"
                            ? "text-green-800"
                            : booking.status === "declined"
                              ? "text-red-800"
                              : "text-gray-800"
                      }`}
                    >
                      {booking.status?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="#333"
                  />
                  <Text className="ml-2 text-sm text-gray-700">
                    {booking.customer?.name || "Customer"}
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="build" size={18} color="#333" />
                  <Text className="ml-2 text-sm text-gray-700">
                    {booking.service_type}
                  </Text>
                </View>

                <View className="flex-row items-center mb-1">
                  <Ionicons name="time-outline" size={18} color="#333" />
                  <Text className="ml-2 text-sm text-gray-700">
                    {new Date(booking.date_time).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="location-outline" size={18} color="#333" />
                  <Text className="ml-2 text-sm text-gray-700">
                    {booking.customer?.location || "Location not specified"}
                  </Text>
                </View>

                {booking.special_instructions && (
                  <View className="mb-3">
                    <Text className="text-xs text-gray-500 mb-1">
                      Special Instructions:
                    </Text>
                    <Text className="text-sm text-gray-700 italic">
                      {booking.special_instructions}
                    </Text>
                  </View>
                )}

                {booking.estimated_price && (
                  <View className="mb-3">
                    <Text className="text-sm font-medium text-green-600">
                      Estimated Price: ₹{booking.estimated_price}
                    </Text>
                  </View>
                )}

                {/* Action Buttons - Only show for pending bookings */}
                {booking.status === "pending" && (
                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      className="bg-cyan-400 px-4 py-2 rounded-md flex-1 mr-2"
                      activeOpacity={0.8}
                      onPress={() => handleAccept(booking.booking_id)}
                    >
                      <Text className="text-white text-sm font-semibold text-center">
                        Accept Booking
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-400 px-4 py-2 rounded-md flex-1 ml-2"
                      activeOpacity={0.8}
                      onPress={() => handleReject(booking.booking_id)}
                    >
                      <Text className="text-white text-sm font-semibold text-center">
                        Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}
