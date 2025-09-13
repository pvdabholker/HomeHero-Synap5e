import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function BookingRequests() {
  const [bookingStatus, setBookingStatus] = useState({});

  const bookingRequests = [
    {
      id: "1220",
      customerName: "Priya Sharma",
      serviceType: "AC Repair",
      date: "3 Sept",
      time: "4:00 PM",
      location: "Panaji Goa",
    },
    {
      id: "1221",
      customerName: "Rajesh Kumar",
      serviceType: "Plumbing",
      date: "4 Sept",
      time: "2:00 PM",
      location: "Margao Goa",
    },
  ];

  const handleAcceptBooking = (bookingId) => {
    console.log(`Accept booking ${bookingId}`);
    setBookingStatus(prev => ({
      ...prev,
      [bookingId]: 'accepted'
    }));
    // Add accept booking logic here
  };

  const handleRejectBooking = (bookingId) => {
    console.log(`Reject booking ${bookingId}`);
    setBookingStatus(prev => ({
      ...prev,
      [bookingId]: 'rejected'
    }));
    // Add reject booking logic here
  };

  const resetBookingStatus = (bookingId) => {
    setBookingStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[bookingId];
      return newStatus;
    });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="bookmark" size={28} color="white" />
            <Text className="text-[#00EAFF] text-2xl font-bold ml-3">
              Booking Requests
            </Text>
          </View>
          <TouchableOpacity>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
              <Ionicons name="person" size={24} color="black" />
            </View>
          </TouchableOpacity>888888-
        </View>
        {/* Thin black line below top nav */}
        <View className="h-px bg-black mt-2"></View>
      </View>

      {/* Main Content */}
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-6">
          {/* Booking Cards */}
          <View className="space-y-6 gap-4">
            {bookingRequests.map((booking) => (
              <View
                key={booking.id}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                {/* Booking ID */}
                <Text className="text-black text-xl font-bold mb-4">
                  Booking #{booking.id}
                </Text>

                {/* Customer Name */}
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person" size={16} color="white" />
                  </View>
                  <Text className="text-black text-lg font-medium">
                    {booking.customerName}
                  </Text>
                </View>

                {/* Service Type */}
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center mr-3">
                    <Ionicons name="chatbubble" size={16} color="white" />
                  </View>
                  <Text className="text-black text-lg font-medium">
                    {booking.serviceType}
                  </Text>
                </View>

                {/* Date and Time */}
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center mr-3">
                    <Ionicons name="time" size={16} color="white" />
                  </View>
                  <Text className="text-black text-lg font-medium">
                    {booking.date}, {booking.time}
                  </Text>
                </View>

                {/* Location */}
                <View className="flex-row items-center mb-6">
                  <View className="w-8 h-8 bg-gray-600 rounded-full items-center justify-center mr-3">
                    <Ionicons name="location" size={16} color="white" />
                  </View>
                  <Text className="text-black text-lg font-medium">
                    {booking.location}
                  </Text>
                </View>

                {/* Status or Action Buttons */}
                {bookingStatus[booking.id] ? (
                  <View className="bg-gray-100 rounded-xl p-4 items-center">
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={bookingStatus[booking.id] === 'accepted' ? "checkmark-circle" : "close-circle"} 
                        size={24} 
                        color={bookingStatus[booking.id] === 'accepted' ? "#10B981" : "#EF4444"} 
                      />
                      <Text className={`text-lg font-semibold ml-2 ${
                        bookingStatus[booking.id] === 'accepted' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bookingStatus[booking.id] === 'accepted' ? 'Booking Accepted' : 'Booking Rejected'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-row gap-8">
                    <TouchableOpacity
                      onPress={() => handleAcceptBooking(booking.id)}
                      className="flex-1 bg-[#00EAFF] py-3 rounded-xl items-center"
                    >
                      <Text className="text-white text-lg font-semibold">
                        Accept Booking
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRejectBooking(booking.id)}
                      className="flex-1 bg-red-500 py-3 rounded-xl items-center"
                    >
                      <Text className="text-white text-lg font-semibold">
                        Reject Booking
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

