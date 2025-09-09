import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "../../../lib/api";

export default function BookStep3() {
  const params = useLocalSearchParams();
  const service = typeof params.service === "string" ? params.service : "";
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let locationParam = undefined;
        try {
          const me = await api.users.me();
          locationParam = me?.location || undefined;
        } catch (e) {}

        const serviceQuery = (service || "").toString().trim().toLowerCase();

        // Try enhanced search: service + location
        let results = await api.providers.search({
          service: serviceQuery || undefined,
          location: locationParam,
          available_only: false,
          limit: 20,
        });

        // Fallback: search only by location (ignore service)
        if (!results || results.length === 0) {
          results = await api.providers.search({
            location: locationParam,
            available_only: false,
            limit: 20,
          });
        }

        // Fallback: plain list, no filters
        if (!results || results.length === 0) {
          results = await api.providers.list({ limit: 20 });
        }

        setProviders(Array.isArray(results) ? results : []);
      } catch (e) {
        setProviders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [service]);

  const handleSelectProvider = (provider) => {
    router.push({
      pathname: "/customerTabs/bookSteps/bookStep4",
      params: { provider: JSON.stringify(provider), service },
    });
  };

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
            Find a Provider
          </Text>
        </View>

        {/* Steps */}
        <View className="flex-row justify-between items-center mb-6">
          {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
            <View key={index} className="items-center flex-1">
              <View
                className={`w-3 h-3 rounded-full ${
                  index <= 2 ? "bg-cyan-400" : "bg-white/50"
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

        {/* Title */}
        <Text className="text-white text-xl font-semibold mb-6">
          Pick Provider {service ? `- ${service}` : ""}
        </Text>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : providers.length === 0 ? (
          <Text className="text-white text-center mt-6">No providers found.</Text>
        ) : (
          providers.map((p) => (
            <View key={p?.provider_id || p?.id} className="bg-white/20 rounded-2xl p-4 mb-5">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: p?.user?.avatar_url || "https://via.placeholder.com/50" }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-white text-base font-semibold">
                      {p?.user?.name || p?.name || "Provider"}
                    </Text>
                    <Text className="text-gray-200 text-sm">
                      {p?.service_type || service || "Service"}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={20} color="gold" />
                  <Text className="text-white ml-1">{p?.rating ?? "4.0"}</Text>
                </View>
              </View>

              <TouchableOpacity
                className="mt-4 bg-white rounded-xl py-2 flex-row items-center justify-center"
                onPress={() => handleSelectProvider(p)}
              >
                <Ionicons name="calendar-outline" size={18} color="black" />
                <Text className="ml-2 font-semibold text-black">
                  Check Availability
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}
