import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";

export default function BookingHistory() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.bookings.my();
      if (Array.isArray(list)) {
        const now = new Date();

        // Process bookings to auto-cancel expired ones
        const processedBookings = list.map((booking) => {
          const bookingTime = new Date(booking.date_time);
          const timeDifference = now - bookingTime; // Past = positive value
          const hoursAfterBooking = timeDifference / (1000 * 60 * 60);

          // If booking time has passed by more than 2 hours and status is still pending/confirmed
          if (
            hoursAfterBooking > 2 &&
            (booking.status === "pending" || booking.status === "confirmed")
          ) {
            

            // Return updated booking object for history display
            return {
              ...booking,
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
              cancellation_reason: "Auto-cancelled: Service time expired",
              updated_at: new Date().toISOString(),
            };
          }

          return booking;
        });

        setBookings(processedBookings);
      } else {
        setBookings([]);
      }
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();

    // Listen for booking cancellation events (including auto-cancellations)
    const sub1 = DeviceEventEmitter.addListener(
      "BOOKING_CANCELLED",
      (eventData) => {
        
        setTimeout(() => {
          loadBookings();
        }, 500);
      }
    );

    return () => {
      sub1.remove();
    };
  }, [loadBookings]);
  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleContactProvider = (booking) => {
    if (booking.provider?.user?.phone) {
      Alert.alert("Contact Provider", `Call ${booking.provider.user.name}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            // In a real app, this would open the phone dialer
            Alert.alert("Call", `Calling ${booking.provider.user.phone}`);
          },
        },
      ]);
    } else {
      Alert.alert("Contact Info", "Provider contact information not available");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        {/* Header - Standard with proper margin for transparent status bar */}
        <View className="px-5 pt-12 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">
            Booking History
          </Text>
        </View>

        {/* Content - Based on loading/data state */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-4">Loading your bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <MaterialIcons name="event-busy" size={50} color="white" />
            <Text className="text-white mt-4 text-center">
              No bookings found
            </Text>
            <TouchableOpacity
              className="bg-white/20 px-6 py-3 rounded-xl mt-4"
              onPress={loadBookings}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          >
            {bookings.map((booking) => (
              <View
                key={booking.booking_id}
                className="bg-white/20 rounded-2xl p-4 mb-4"
              >
                {/* Header with Status */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold">
                      {booking.service_type || "Service"}
                    </Text>
                    <Text className="text-gray-200 text-sm">
                      Booking ID: #{booking.booking_id}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    <Text className="text-white text-xs font-medium uppercase">
                      {booking.status || "pending"}
                    </Text>
                  </View>
                </View>

                {/* Provider Information */}
                <View className="mb-3">
                  <Text className="text-gray-300 text-sm mb-1">Provider</Text>
                  <Text className="text-white">
                    {booking.provider?.user?.name ||
                      booking.provider?.name ||
                      "Provider Name"}
                  </Text>
                  {booking.provider?.user?.phone && (
                    <Text className="text-gray-200 text-sm">
                      📞 {booking.provider.user.phone}
                    </Text>
                  )}
                </View>

                {/* Date & Time */}
                <View className="mb-3">
                  <Text className="text-gray-300 text-sm mb-1">Scheduled</Text>
                  <Text className="text-white">
                    📅 {formatDate(booking.date_time)}
                  </Text>
                </View>

                {/* Pricing Information */}
                {(booking.estimated_price || booking.provider?.hourly_rate) && (
                  <View className="mb-3 pt-3 border-t border-white/20">
                    <Text className="text-gray-300 text-sm mb-1">Pricing</Text>
                    {booking.estimated_price && (
                      <Text className="text-green-300 font-semibold">
                        💰 Total: ₹{booking.estimated_price}
                      </Text>
                    )}
                    {booking.provider?.hourly_rate && (
                      <Text className="text-gray-200 text-sm">
                        Rate: ₹{booking.provider.hourly_rate}/hr
                      </Text>
                    )}
                  </View>
                )}

                {/* Location */}
                {booking.location && (
                  <View className="mb-3">
                    <Text className="text-gray-300 text-sm mb-1">Location</Text>
                    <Text className="text-white">📍 {booking.location}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View className="flex-row gap-2 mt-3">
                  {booking.status === "confirmed" && (
                    <TouchableOpacity
                      className="flex-1 bg-blue-500 py-2 rounded-xl"
                      onPress={() => handleContactProvider(booking)}
                    >
                      <Text className="text-white text-center font-medium">
                        Contact Provider
                      </Text>
                    </TouchableOpacity>
                  )}

                  {booking.status === "cancelled" && (
                    <TouchableOpacity
                      className="flex-1 bg-gray-500 py-2 rounded-xl"
                      onPress={() => {
                        Alert.alert(
                          "Booking Cancelled",
                          `This booking was cancelled on ${new Date(
                            booking.updated_at || booking.created_at
                          ).toLocaleDateString()}`
                        );
                      }}
                    >
                      <Text className="text-white text-center font-medium">
                        View Details
                      </Text>
                    </TouchableOpacity>
                  )}

                  {booking.status === "pending" && (
                    <TouchableOpacity className="flex-1 bg-orange-500 py-2 rounded-xl">
                      <Text className="text-white text-center font-medium">
                        Waiting Confirmation
                      </Text>
                    </TouchableOpacity>
                  )}

                  {booking.status === "completed" && (
                    <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-xl">
                      <Text className="text-white text-center font-medium">
                        Rate Service
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Cancellation Note */}
                {booking.status === "cancelled" &&
                  booking.cancellation_reason && (
                    <View className="mt-3 p-2 bg-red-100/20 rounded-lg">
                      <Text className="text-red-300 text-sm">
                        Reason: {booking.cancellation_reason}
                      </Text>
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
