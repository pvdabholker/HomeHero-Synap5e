import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../../../lib/api";

export default function BookStep4() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const providerParam = params.provider;
  const selectedProvider = providerParam ? JSON.parse(providerParam) : null;
  const service = typeof params.service === "string" ? params.service : "";
  const addressParam = typeof params.address === "string" ? params.address : "";

  const [dateTime, setDateTime] = useState("");
  const [displayAddress, setDisplayAddress] = useState(addressParam);

  useEffect(() => {
    const nextHour = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16); // yyyy-MM-ddTHH:mm
    setDateTime(nextHour);
  }, []);

  useEffect(() => {
    (async () => {
      if (!displayAddress) {
        try {
          const me = await api.users.me();
          setDisplayAddress(
            [me?.location, me?.pincode].filter(Boolean).join(", ")
          );
        } catch (e) {}
      }
    })();
  }, [displayAddress]);

  const createBooking = async () => {
    try {
      if (!selectedProvider) {
        Alert.alert("Select provider", "Please go back and select a provider.");
        return;
      }
      const isoDate = new Date(dateTime).toISOString();
      const payload = {
        provider_id: selectedProvider?.provider_id || selectedProvider?.id,
        service_type: selectedProvider?.service_type || service || "service",
        date_time: isoDate,
      };
      await api.bookings.create(payload);
      // Show confirmation popup then navigate to Home
      setShowModal(true);
      // Emit event to refresh bookings list
      DeviceEventEmitter.emit("BOOKING_CONFIRMED");
      setTimeout(() => {
        setShowModal(false);
        router.push({ pathname: "/customerTabs/home" });
      }, 1200);
    } catch (e) {
      const msg = e?.message || "Failed to create booking";
      if (msg.toLowerCase().includes("unauthorized") || msg.includes("401")) {
        Alert.alert("Login required", "Please log in to place a booking.", [
          {
            text: "OK",
            onPress: () => router.replace("/auth/customer/customerLogin"),
          },
        ]);
      } else {
        Alert.alert("Error", msg);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="ml-3 text-lg font-semibold text-white">Summary</Text>
        </View>

        {/* Steps */}
        <View className="flex-row justify-between items-center mb-6">
          {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
            <View key={index} className="items-center flex-1">
              <View
                className={`w-3 h-3 rounded-full ${
                  index <= 3 ? "bg-cyan-400" : "bg-white/50"
                }`}
              />
              <Text className="text-xs text-white mt-2">{step}</Text>
              <Text className="text-[10px] text-white/70">
                {
                  ["Select Services", "Location", "Pick Provider", "Summary"][
                    index
                  ]
                }
              </Text>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-white/40 mb-6" />

        <Text className="text-center text-white text-lg font-semibold mb-6">
          Booking Details
        </Text>

        {/* Provider details */}
        <View className="bg-white/20 rounded-2xl p-4 mb-6">
          <Text className="text-white text-base font-semibold mb-2">
            Provider
          </Text>
          <Text className="text-white">
            {selectedProvider?.user?.name ||
              selectedProvider?.name ||
              "Provider"}
          </Text>
          <Text className="text-gray-200 text-sm">
            {selectedProvider?.service_type || service || "Service"}
          </Text>
        </View>

        {/* Service and Address display */}
        <View className="bg-white/20 rounded-2xl p-4 mb-6">
          <Text className="text-white text-base">Service</Text>
          <Text className="text-gray-200 mt-1">
            {selectedProvider?.service_type || service || "Service"}
          </Text>
          <Text className="text-white text-base mt-4">Location</Text>
          <Text className="text-gray-200 mt-1">
            {displayAddress || "Not set"}
          </Text>
        </View>

        {/* Date & Time Selection */}
        <View className="bg-white/20 rounded-2xl p-4 mb-6">
          <Text className="text-white text-base font-semibold mb-2">
            Date & Time
          </Text>
          <View className="flex-row space-x-2 gap-2">
            <View className="flex-1">
              <Text className="text-white text-sm mb-1">Date</Text>
              <TextInput
                value={dateTime.split("T")[0]}
                onChangeText={(date) =>
                  setDateTime(date + "T" + (dateTime.split("T")[1] || "00:00"))
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#ddd"
                className="bg-white rounded-xl px-3 py-2 text-gray-800"
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm mb-1">Time</Text>
              <TextInput
                value={dateTime.split("T")[1]}
                onChangeText={(time) =>
                  setDateTime(
                    (dateTime.split("T")[0] ||
                      new Date().toISOString().split("T")[0]) +
                      "T" +
                      time
                  )
                }
                placeholder="HH:mm"
                placeholderTextColor="#ddd"
                className="bg-white rounded-xl px-3 py-2 text-gray-800"
              />
            </View>
          </View>
          <Text className="text-gray-300 text-xs mt-2">
            Time format: 24-hour (e.g., 14:30 for 2:30 PM)
          </Text>
        </View>

        <TouchableOpacity
          onPress={createBooking}
          className="mt-2 bg-cyan-400 py-3 rounded-xl"
        >
          <Text className="text-center text-white font-semibold text-base">
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80 items-center shadow-lg">
            <View className="w-16 h-16 rounded-full bg-cyan-400 justify-center items-center mb-4">
              <Text className="text-white text-3xl">✓</Text>
            </View>

            <Text className="text-xl font-semibold mb-2 text-black">
              Booking Confirmed
            </Text>
            <Text className="text-center text-gray-600 mb-2">
              Redirecting to home...
            </Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
