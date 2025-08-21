import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Ionicons} from "@expo/vector-icons";
import { router } from "expo-router";

export default function BookStep4({ navigation }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <LinearGradient
      colors={["#1e0a47", "#3c3b6e", "#6b6b9e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="ml-3 text-lg font-semibold text-white">
            Find Provider
          </Text>
        </View>

        {/* Stepper */}
        <View className="flex-row justify-between items-center mb-10">
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

        {/* Booking Details */}
        <Text className="text-center text-white text-lg font-semibold mb-6">
          Booking Details
        </Text>

        <View className="flex-col space-y-4 gap-4 mb-6">
          {[
            { label: "Service:", value: "Plumbing" },
            { label: "Date & Time:", value: "Mon, August 25, 2025 at 9:32 AM" },
            { label: "Location:", value: "Margao Goa" },
            { label: "Provider:", value: "John Smith" },
          ].map((item, idx) => (
            <View key={idx} className="flex-row justify-between items-center">
              <Text className="text-white text-base">{item.label}</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-base mr-2">{item.value}</Text>
                <TouchableOpacity>
                  <Text className="text-white text-lg">✎</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="mt-10 bg-cyan-400 py-3 rounded-xl"
        >
          <Text className="text-center text-white font-semibold text-base">
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Booking Confirmed Popup */}
      <Modal visible={showModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 w-80 items-center shadow-lg">
            {/* Tick */}
            <View className="w-16 h-16 rounded-full bg-cyan-400 justify-center items-center mb-4">
              <Text className="text-white text-3xl">✓</Text>
            </View>

            {/* Message */}
            <Text className="text-xl font-semibold mb-2 text-black">
              Booking Confirmed
            </Text>
            <Text className="text-center text-gray-600 mb-6">
              Your request has been successfully placed
            </Text>

            {/* Go to Home */}
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                router.push("../home"); 
              }}
              className="bg-cyan-400 py-3 px-6 rounded-xl w-full"
            >
              <Text className="text-center text-white font-semibold">
                Go to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
