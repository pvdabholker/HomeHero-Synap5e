import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function JobCompletion() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold ml-3">Job Completion</Text>
          </View>
          <Text className="text-[#00EAFF] text-base font-semibold">HomeHero</Text>
        </View>
        <View className="h-px bg-black mt-2"></View>
      </View>

      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-6 shadow-md">
            {/* Big Check icon */}
            <View className="items-center mb-6">
              <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center">
                <Ionicons name="checkmark" size={56} color="#22c55e" />
              </View>
              <Text className="text-black text-2xl font-bold mt-4">Job Completed</Text>
            </View>

            {/* Details */}
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={18} color="#9CA3AF" />
              </View>
              <View>
                <Text className="text-black text-base font-semibold">Booking #1024</Text>
                <Text className="text-black text-base mt-2">Priya Sharma</Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <Ionicons name="calendar" size={18} color="#111827" />
              <Text className="text-gray-700 text-base ml-3">3 Sept 2023</Text>
            </View>

            {/* Back to Home button */}
            <TouchableOpacity
              onPress={() => router.push("/serviceProviderTabs/home")}
              className="bg-[#1d4ed8] py-3 rounded-xl items-center mt-8"
            >
              <Text className="text-white text-lg font-semibold">Back to Home</Text>
            </TouchableOpacity>

            {/* Notes intentionally omitted */}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}



