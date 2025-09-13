import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationsContent() {
  const router = useRouter();

  const items = [
    { id: "n1", type: "primary", title: "Booking #1024 has\nbeen accepted" },
    {
      id: "n2",
      type: "detail",
      rows: [
        { icon: "mail", text: "New booking request\nfrom Priya Sharma", time: "Just now" },
        { icon: "call", text: "+91 9876543210", time: "30 min ago" },
      ],
    },
    { id: "n3", type: "secondary", title: "Booking #1023\nhas been completed", time: "Today" },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold ml-3">Notifications</Text>
          </View>
          <Text className="text-[#00EAFF] text-base font-semibold">HomeHero</Text>
        </View>
        <View className="h-px bg-black mt-2"></View>
      </View>

      {/* Main Content */}
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="space-y-6 gap-4">
            {items.map((item) => {
              if (item.type === "primary") {
                return (
                  <View key={item.id} className="bg-white rounded-2xl p-4 shadow-md">
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
                        <Ionicons name="person" size={22} color="#9CA3AF" />
                      </View>
                      <Text className="text-black text-xl font-semibold leading-6">{item.title}</Text>
                    </View>
                  </View>
                );
              }

              if (item.type === "detail") {
                return (
                  <View key={item.id} className="bg-white rounded-2xl p-4 shadow-md">
                    {item.rows.map((row, idx) => (
                      <View key={idx} className={`flex-row items-center ${idx === 0 ? "mb-4" : ""}`}>
                        <Ionicons name={row.icon} size={18} color="#111827" />
                        <Text className="text-black text-base ml-3 flex-1 leading-5">{row.text}</Text>
                        <Text className="text-gray-500 text-sm ml-3">{row.time}</Text>
                      </View>
                    ))}
                  </View>
                );
              }

              return (
                <View key={item.id} className="bg-white rounded-2xl p-4 shadow-md flex-row items-center">
                  <Ionicons name="images" size={18} color="#111827" />
                  <Text className="text-black text-base ml-3 flex-1 leading-5">{item.title}</Text>
                  <Text className="text-gray-500 text-sm ml-3">{item.time}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


