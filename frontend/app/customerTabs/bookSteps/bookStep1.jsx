import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";

export default function BookService() {
  const [selected, setSelected] = useState("Plumbing");

  const services = [
    {
      name: "Cleaning",
      icon: <FontAwesome5 name="broom" size={28} color="black" />,
    },
    {
      name: "Plumbing",
      icon: <MaterialCommunityIcons name="pipe" size={28} color="black" />,
    },
    {
      name: "Paint",
      icon: <MaterialIcons name="format-paint" size={28} color="black" />,
    },
    {
      name: "Carpentry",
      icon: <MaterialCommunityIcons name="saw-blade" size={28} color="black" />,
    },
  ];

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1 px-4 pt-12"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="ml-3 text-lg font-semibold text-white">
          Book a Service
        </Text>
      </View>

      {/* Steps */}
      <View className="flex-row justify-between items-center mb-6">
        {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
          <View key={index} className="items-center flex-1">
            <View
              className={`w-3 h-3 rounded-full ${
                index === 0 ? "bg-cyan-400" : "bg-white/50"
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

      {/* Question */}
      <Text className="text-white text-base font-medium mb-4">
        What kind of service do you need?
      </Text>

      {/* Service Options */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {services.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelected(item.name)}
            className={`flex-row items-center justify-center py-6 rounded-xl mb-4 ${
              selected === item.name ? "bg-white" : "bg-white/20"
            }`}
          >
            <View className="mr-3">{item.icon}</View>
            <Text
              className={`text-lg ${
                selected === item.name
                  ? "text-black font-semibold"
                  : "text-white"
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity
        className="mt-auto mb-12"
        onPress={() => router.push("/customerTabs/bookSteps/bookStep2")}
      >
        <LinearGradient
          colors={["#00c6ff", "#00aaff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="py-4 rounded-xl"
        >
          <Text className="text-center text-white text-base font-semibold">
            Continue
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}
