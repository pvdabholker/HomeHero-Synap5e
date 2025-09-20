import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  DeviceEventEmitter,
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { api } from "../../../lib/api";
import { showErrorAlert } from "../../../lib/alerts";

export default function BookStep4() {
  // Go to previous step (bookStep3) with params
  const goBackToStep3 = () => {
    router.replace({
      pathname: "/customerTabs/bookSteps/bookStep3",
      params: {
        service,
        // You can add more params if needed
      },
    });
  };

  // Handle hardware/system back button
  useEffect(() => {
    const onBackPress = () => {
      goBackToStep3();
      return true; // prevent default
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => {
      backHandler.remove();
    };
  }, [service]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const providerParam = params.provider;
  const selectedProvider = providerParam ? JSON.parse(providerParam) : null;
  const service = typeof params.service === "string" ? params.service : "";
  const addressParam = typeof params.address === "string" ? params.address : "";

  const [dateTime, setDateTime] = useState("");
  const [displayAddress, setDisplayAddress] = useState(addressParam);
  const [selectedTime, setSelectedTime] = useState(""); // For 12-hour display
  const [isAM, setIsAM] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper function to convert 24-hour to 12-hour format
  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";
    return { time: `${hour12}:${minutes}`, isAM: ampm === "AM" };
  };

  // Helper function to convert 12-hour to 24-hour format
  const convertTo24Hour = (time12, isAM) => {
    if (!time12) return "00:00";
    const [hours, minutes] = time12.split(":");
    let hour24 = parseInt(hours);
    if (isAM && hour24 === 12) hour24 = 0;
    if (!isAM && hour24 !== 12) hour24 += 12;
    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const dateStr = selectedDate.toISOString().split("T")[0];
      const time24 = convertTo24Hour(selectedTime, isAM);
      setDateTime(dateStr + "T" + time24);
    }
  };

  useEffect(() => {
    const nextHour = new Date(Date.now() + 60 * 60 * 1000);
    const nextHourISO = nextHour.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    setDateTime(nextHourISO);
    setSelectedDate(nextHour);

    // Initialize 12-hour time display
    const time24 = nextHourISO.split("T")[1];
    if (time24) {
      const { time, isAM: am } = convertTo12Hour(time24);
      setSelectedTime(time);
      setIsAM(am);
    }
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
        showErrorAlert("Please go back and select a provider.");
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
        showErrorAlert(msg);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#1d1664" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1d1664"
        translucent={false}
      />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        {/* Fixed Header */}
        <View className="px-6 pt-4 mt-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={goBackToStep3}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="ml-3 text-lg font-semibold text-white">
              Summary
            </Text>
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
        </View>

        {/* Scrollable Booking Details */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
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

            {/* Display pricing */}
            <View className="mt-3 pt-3 border-t border-white/20">
              <Text className="text-white text-sm font-medium mb-1">
                Pricing
              </Text>
              <Text className="text-green-300 text-base font-semibold">
                {selectedProvider?.hourly_rate
                  ? `₹${selectedProvider.hourly_rate}/hr`
                  : selectedProvider?.pricing?.hourly_rate
                    ? `₹${selectedProvider.pricing.hourly_rate}/hr`
                    : selectedProvider?.base_price
                      ? `₹${selectedProvider.base_price}`
                      : "Price on request"}
              </Text>

              {/* Show minimum charge if available */}
              {(selectedProvider?.minimum_charge ||
                selectedProvider?.base_price) && (
                <Text className="text-gray-300 text-xs mt-1">
                  Minimum charge: ₹
                  {selectedProvider?.minimum_charge ||
                    selectedProvider?.base_price}
                </Text>
              )}
            </View>
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

            {/* Date Selection */}
            <View className="mb-4">
              <Text className="text-white text-sm mb-1">Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-white rounded-xl px-3 py-2 flex-row items-center justify-between"
              >
                <Text className="text-gray-800">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
                <Ionicons name="calendar" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Time Selection */}
            <View>
              <Text className="text-white text-sm mb-1">Time</Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={selectedTime}
                  onChangeText={(time) => {
                    setSelectedTime(time);
                    const time24 = convertTo24Hour(time, isAM);
                    const dateStr = selectedDate.toISOString().split("T")[0];
                    setDateTime(dateStr + "T" + time24);
                  }}
                  placeholder="12:00"
                  placeholderTextColor="#ddd"
                  className="bg-white rounded-xl px-3 py-2 text-gray-800 flex-1"
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsAM(!isAM);
                    const time24 = convertTo24Hour(selectedTime, !isAM);
                    const dateStr = selectedDate.toISOString().split("T")[0];
                    setDateTime(dateStr + "T" + time24);
                  }}
                  className="bg-white rounded-xl px-3 py-2 justify-center"
                >
                  <Text className="text-gray-800 font-medium">
                    {isAM ? "AM" : "PM"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-gray-300 text-xs mt-2">
              Tap on date to open calendar. Time format: 12-hour (e.g., 2:30 PM)
            </Text>
          </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </ScrollView>

        {/* Fixed Confirm Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            onPress={createBooking}
            className="bg-cyan-400 py-3 rounded-xl"
          >
            <Text className="text-center text-white font-semibold text-base">
              Confirm Booking
            </Text>
          </TouchableOpacity>
        </View>

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
    </SafeAreaView>
  );
}
