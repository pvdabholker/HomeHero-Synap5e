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
import * as Linking from "expo-linking";

export default function ContactCustomers() {
  const router = useRouter();

  const customers = [
    { id: "c1", name: "Priya Sharma", phone: "+919876543223" },
    { id: "c2", name: "Rajesh Kumar", phone: "+919812345678" },
    { id: "c3", name: "Sneha Patel", phone: "+919900112233" },
    { id: "c4", name: "Aman Verma", phone: "+919811112222" },
    { id: "c5", name: "Neha Gupta", phone: "+919733344455" },
  ];

  const handleCall = (phone) => {
    try {
      Linking.openURL(`tel:${phone}`);
    } catch (e) {
      console.warn("Unable to start call", e);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-[#00EAFF] text-3xl font-bold ml-3">
              Contact Customer
            </Text>
          </View>
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center">
            <Ionicons name="person" size={24} color="black" />
          </View>
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
        <ScrollView
          className="flex-1 px-6 py-6"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="space-y-4 gap-3">
            {customers.map((c) => (
              <View key={c.id} className="bg-white rounded-xl p-4 shadow-md">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person" size={18} color="#000" />
                  </View>
                  <Text className="text-black text-base font-semibold">{c.name}</Text>
                </View>

                <View className="flex-row items-center mb-4">
                  <Ionicons name="call" size={16} color="#111" />
                  <Text className="text-black text-sm ml-3">{c.phone}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleCall(c.phone)}
                  className="bg-[#00EAFF] py-2.5 rounded-lg items-center"
                >
                  <Text className="text-white text-base font-semibold">Call</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


