import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function ServiceProviderNotifications() {
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="notifications" size={24} color="white" />
            <Text className="text-[#00EAFF] text-xl font-bold ml-2">Notifications</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-white rounded-2xl p-6">
            <Text className="text-black text-lg font-semibold text-center">
              Notifications
            </Text>
            <Text className="text-gray-600 text-sm text-center mt-2">
              Stay updated with your service requests
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


