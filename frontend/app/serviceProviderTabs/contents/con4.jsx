import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Availability() {
  const router = useRouter();

  const initial = [
    { id: 1, day: "Monday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { id: 2, day: "Tuesday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { id: 3, day: "Wednesday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { id: 4, day: "Thursday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { id: 5, day: "Saturday", start: "9:00 AM", end: "5:00 PM", enabled: true },
    { id: 6, day: "Sunday", start: "9:00 AM", end: "5:00 PM", enabled: false },
  ];

  const [days, setDays] = useState(initial);
  const [editingId, setEditingId] = useState(null);

  const toggleDay = (id) => {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)));
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#1d1664] pt-12 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-semibold ml-3">Availability</Text>
          </View>
          <Text className="text-[#00EAFF] text-base font-semibold">HomeHero</Text>
        </View>
        <View className="h-px bg-black mt-2"></View>
      </View>

      {/* Main */}
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-6 shadow-md">
            {days.map((d, idx) => (
              <View key={d.id} className={`flex-row items-center ${idx !== days.length - 1 ? "mb-6" : ""}`}>
                <Text className="text-black text-xl font-semibold flex-1">{d.day}</Text>
                <View className="flex-row items-center mr-4">
                  {d.enabled && editingId === d.id ? (
                    <>
                      <TextInput
                        className={`border rounded-lg px-3 py-2 w-28 text-center mr-2 border-gray-300 text-black`}
                        value={d.start}
                        onChangeText={(t) =>
                          setDays((prev) => prev.map((x) => (x.id === d.id ? { ...x, start: t } : x)))
                        }
                        placeholder="Start"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text className={`mx-1 text-gray-700`}>–</Text>
                      <TextInput
                        className={`border rounded-lg px-3 py-2 w-28 text-center ml-2 border-gray-300 text-black`}
                        value={d.end}
                        onChangeText={(t) =>
                          setDays((prev) => prev.map((x) => (x.id === d.id ? { ...x, end: t } : x)))
                        }
                        placeholder="End"
                        placeholderTextColor="#9CA3AF"
                      />
                      <TouchableOpacity onPress={() => setEditingId(null)} className="ml-2">
                        <Ionicons name="checkmark" size={22} color="#111827" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      disabled={!d.enabled}
                      onPress={() => setEditingId(d.id)}
                    >
                      <Text className={`${d.enabled ? "text-gray-700" : "text-gray-300"} text-base`}>
                        {d.start && d.end ? `${d.start} – ${d.end}` : ""}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Switch
                  value={d.enabled}
                  onValueChange={() => toggleDay(d.id)}
                  thumbColor={d.enabled ? "#ffffff" : "#ffffff"}
                  trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                />
              </View>
            ))}
          </View>
          {/* Notes intentionally omitted */}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}


