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

export default function ServiceProviderHome() {
  const router = useRouter();
  
  const menuItems = [
    {
      id: 1,
      icon: "document-text",
      title: "Booking Request",
      subtitle: "View and manage your booking",
    },
    {
      id: 2,
      icon: "chatbubble",
      title: "Contact Customer",
      subtitle: "Call or email your customer",
    },
    {
      id: 3,
      icon: "notifications",
      title: "Notifications",
      subtitle: "Read recent updates",
    },
    {
      id: 4,
      icon: "calendar",
      title: "Availability",
      subtitle: "See your schedule",
    },
    {
      id: 5,
      icon: "checkmark-circle",
      title: "Job Completion",
      subtitle: "Finalized completed jobs",
    },
  ];

  const handleMenuPress = (item) => {
    console.log(`${item.title} pressed`);
    if (item.title === "Booking Request") {
      router.push("/serviceProviderTabs/contents/con1");
    }
    if (item.title === "Contact Customer") {
      router.push("/serviceProviderTabs/contents/con2");
    }
    if (item.title === "Notifications") {
      router.push("/serviceProviderTabs/contents/con3");
    }
    if (item.title === "Availability") {
      router.push("/serviceProviderTabs/contents/con4");
    }
    if (item.title === "Job Completion") {
      router.push("/serviceProviderTabs/contents/con5");
    }
    // Add navigation logic for other items here
  };
  


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="home" size={28} color="white" />
            <Text className="text-[#00EAFF] text-3xl font-bold ml-3">
              HomeHero
            </Text>
          </View>
          <TouchableOpacity>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
              <Ionicons name="person" size={24} color="black" />
            </View>
          </TouchableOpacity>
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
        <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {/* Menu Cards with gap */}
          <View className="space-y-6 gap-4">
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuPress(item)}
                className="bg-white rounded-2xl p-5 flex-row items-center shadow-lg"
              >
                <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name={item.icon} size={26} color="#000000" />
                </View>
                <View className="flex-1 p-2">
                  <Text className="text-black text-xl font-semibold mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-base">
                    {item.subtitle}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
