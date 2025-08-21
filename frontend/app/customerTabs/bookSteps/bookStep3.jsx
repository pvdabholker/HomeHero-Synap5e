import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function BookStep3({ navigation }) {
  const providers = [
    { id: 1, name: "John Smith", role: "Plumber", rating: 4.0 },
    { id: 2, name: "John Smith", role: "Electrician", rating: 3.9 },
    { id: 3, name: "John Smith", role: "Painter", rating: 4.5 },
  ];

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView contentContainerStyle={{ padding: 20, marginTop: 20 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <Ionicons name="arrow-back" size={24} color="white" />
          <Text className="ml-3 text-lg font-semibold text-white">
            Find Provider
          </Text>
        </View>

        {/* Progress Steps */}
        <View className="flex-row justify-between items-center mb-6">
          {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
            <View key={index} className="items-center flex-1">
              <View
                className={`w-3 h-3 rounded-full  ${
                  index <= 2 ? "bg-cyan-400" : "bg-white/50"
                }`}
              />
              <Text className="text-white text-xs mt-2">{step}</Text>
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

        {/* Title */}
        <Text className="text-white text-xl font-semibold mb-6">
          Pick Provider
        </Text>

        {/* Providers List */}
        {providers.map((provider) => (
          <View key={provider.id} className="bg-white/20 rounded-2xl p-4 mb-5">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: "https://via.placeholder.com/50" }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View>
                  <Text className="text-white text-base font-semibold">
                    {provider.name}
                  </Text>
                  <Text className="text-gray-200 text-sm">{provider.role}</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <MaterialIcons name="star" size={20} color="gold" />
                <Text className="text-white ml-1">{provider.rating}</Text>
              </View>
            </View>

            <TouchableOpacity
              className="mt-4 bg-white rounded-xl py-2 flex-row items-center justify-center"
              onPress={(()=>router.push("/customerTabs/bookSteps/bookStep4"))} // change route
            >
              <Ionicons name="calendar-outline" size={18} color="black" />
              <Text className="ml-2 font-semibold text-black">
                Check Availability
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
