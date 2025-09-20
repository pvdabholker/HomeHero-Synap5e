import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
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

        // Try enhanced search: service + location with pricing
        let results = await api.providers.search({
          service: serviceQuery || undefined,
          location: locationParam,
          available_only: false,
          include_pricing: true, // Request pricing information
          limit: 20,
        });

        // Fallback: search only by location (ignore service) with pricing
        if (!results || results.length === 0) {
          results = await api.providers.search({
            location: locationParam,
            available_only: false,
            include_pricing: true,
            limit: 20,
          });
        }

        // Fallback: plain list, no filters but with pricing
        if (!results || results.length === 0) {
          results = await api.providers.list({
            limit: 20,
            include_pricing: true,
          });
        }

        // If we have providers, fetch detailed pricing for each
        if (Array.isArray(results) && results.length > 0) {
          const providersWithPricing = await Promise.all(
            results.map(async (provider) => {
              try {
                // Fetch detailed provider info including pricing
                const detailedProvider = await api.providers.getById(
                  provider.provider_id || provider.id
                );
                return {
                  ...provider,
                  ...detailedProvider,
                  // Merge pricing information
                  pricing: detailedProvider?.pricing || provider?.pricing,
                  hourly_rate:
                    detailedProvider?.hourly_rate || provider?.hourly_rate,
                  base_price:
                    detailedProvider?.base_price || provider?.base_price,
                  minimum_charge:
                    detailedProvider?.minimum_charge ||
                    provider?.minimum_charge,
                };
              } catch (e) {
                // If individual provider fetch fails, return original data
                return provider;
              }
            })
          );
          setProviders(providersWithPricing);
        } else {
          setProviders([]);
        }
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

  // Go to previous step (bookStep2) with params
  const goBackToStep2 = () => {
    router.replace({
      pathname: "/customerTabs/bookSteps/bookStep2",
      params: {
        service,
      },
    });
  };

  // Handle hardware/system back button
  useEffect(() => {
    const onBackPress = () => {
      goBackToStep2();
      return true; // prevent default
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => {
      backHandler.remove();
    };
  }, [service]);

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1" style={{ padding: 20, marginTop: 20 }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={goBackToStep2}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
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

        {/* Providers List - Only this section scrolls */}
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="#fff" />
          </View>
        ) : providers.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-center">No providers found.</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {providers.map((p) => (
              <View
                key={p?.provider_id || p?.id}
                className="bg-white/20 rounded-2xl p-4 mb-5"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Image
                      source={{
                        uri:
                          p?.user?.avatar_url ||
                          "https://via.placeholder.com/50",
                      }}
                      className="w-12 h-12 rounded-full mr-3"
                    />
                    <View>
                      <Text className="text-white text-base font-semibold">
                        {p?.user?.name || p?.name || "Provider"}
                      </Text>
                      <Text className="text-gray-200 text-sm">
                        {p?.service_type || service || "Service"}
                      </Text>
                      {/* Display charges from backend */}
                      <Text className="text-green-300 text-sm font-medium">
                        {p?.hourly_rate
                          ? `₹${p.hourly_rate}/hr`
                          : p?.pricing?.hourly_rate
                            ? `₹${p.pricing.hourly_rate}/hr`
                            : p?.base_price
                              ? `₹${p.base_price}`
                              : "Price on request"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons name="star" size={20} color="gold" />
                    <Text className="text-white ml-1">
                      {p?.rating ?? "4.0"}
                    </Text>
                  </View>
                </View>

                {/* Additional pricing info if available */}
                {(p?.minimum_charge || p?.base_price) && (
                  <View className="mt-3 bg-white/10 rounded-lg p-2">
                    <Text className="text-white text-xs">
                      Minimum charge: ₹
                      {p?.minimum_charge || p?.base_price || "200"}
                    </Text>
                  </View>
                )}

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
            ))}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
}
