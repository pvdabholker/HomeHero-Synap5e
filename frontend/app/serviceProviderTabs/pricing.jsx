import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api, TokenStore } from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProviderPricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricing, setPricing] = useState({
    hourly_rate: 0,
    minimum_charge: 0,
    base_price: 0,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeTokens();
      await loadPricing();
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  const initializeTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (accessToken) {
        TokenStore.setTokens({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    } catch (error) {
      console.error("Error initializing tokens:", error);
    }
  };

  const loadPricing = async () => {
    try {
      setLoading(true);
      const profile = await api.providers.me();

      setPricing({
        hourly_rate: profile?.pricing || 0,
        minimum_charge: profile?.minimum_charge || 0,
        base_price: profile?.base_price || 0,
      });
    } catch (error) {
      console.error("Error loading pricing:", error);
      Alert.alert("Error", "Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  const updatePricing = async () => {
    try {
      setSaving(true);

      await api.providers.updatePricing({
        pricing: parseFloat(pricing.hourly_rate) || 0,
      });

      // Also update other pricing fields if the API supports it
      await api.providers.updateMe({
        pricing: parseFloat(pricing.hourly_rate) || 0,
        // Add other fields when backend supports them
      });

      Alert.alert("Success", "Pricing updated successfully!");
    } catch (error) {
      console.error("Error updating pricing:", error);
      Alert.alert("Error", "Failed to update pricing. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#1d1664" />
        <LinearGradient
          colors={["#1d1664", "#c3c0d6"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-4">Loading pricing...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1d1664" />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white ml-3">
            Manage Pricing
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Pricing Information */}
          <View className="bg-white/10 rounded-xl p-4 mb-6">
            <Ionicons name="information-circle" size={24} color="#00BCD4" />
            <Text className="text-white font-medium mt-2 mb-2">
              Pricing Guidelines
            </Text>
            <Text className="text-gray-200 text-sm">
              • Set competitive rates based on your experience and local market
            </Text>
            <Text className="text-gray-200 text-sm">
              • Hourly rate is shown to customers for estimation
            </Text>
            <Text className="text-gray-200 text-sm">
              • You can negotiate final pricing during booking confirmation
            </Text>
          </View>

          {/* Hourly Rate */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-4">
              Service Rates
            </Text>

            <View className="mb-4">
              <Text className="text-gray-200 mb-2">Hourly Rate (₹/hour)</Text>
              <TextInput
                value={pricing.hourly_rate.toString()}
                onChangeText={(text) =>
                  setPricing((prev) => ({ ...prev, hourly_rate: text }))
                }
                className="bg-white/20 rounded-lg p-3 text-white text-lg"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text className="text-gray-300 text-sm mt-1">
                This is your standard hourly rate shown to customers
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-200 mb-2">Minimum Charge (₹)</Text>
              <TextInput
                value={pricing.minimum_charge.toString()}
                onChangeText={(text) =>
                  setPricing((prev) => ({ ...prev, minimum_charge: text }))
                }
                className="bg-white/20 rounded-lg p-3 text-white text-lg"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text className="text-gray-300 text-sm mt-1">
                Minimum amount you charge regardless of time spent
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-gray-200 mb-2">Base Service Price (₹)</Text>
              <TextInput
                value={pricing.base_price.toString()}
                onChangeText={(text) =>
                  setPricing((prev) => ({ ...prev, base_price: text }))
                }
                className="bg-white/20 rounded-lg p-3 text-white text-lg"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
              <Text className="text-gray-300 text-sm mt-1">
                Fixed price for standard services (alternative to hourly)
              </Text>
            </View>
          </View>

          {/* Pricing Preview */}
          <View className="bg-white/10 rounded-xl p-4 mb-6">
            <Text className="text-white font-semibold mb-3">
              Pricing Preview
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-200">1 hour service:</Text>
              <Text className="text-cyan-400 font-medium">
                ₹{Math.max(pricing.hourly_rate, pricing.minimum_charge)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-200">2 hour service:</Text>
              <Text className="text-cyan-400 font-medium">
                ₹{Math.max(pricing.hourly_rate * 2, pricing.minimum_charge)}
              </Text>
            </View>

            {pricing.base_price > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-200">Fixed service price:</Text>
                <Text className="text-cyan-400 font-medium">
                  ₹{pricing.base_price}
                </Text>
              </View>
            )}
          </View>

          {/* Additional Pricing Options */}
          <View className="mb-6">
            <Text className="text-white text-lg font-semibold mb-4">
              Additional Options
            </Text>

            <TouchableOpacity className="bg-white/20 rounded-lg p-4 mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-white font-medium">
                  Emergency Service Rate
                </Text>
                <Text className="text-gray-300 text-sm">
                  Higher rate for urgent calls
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white/20 rounded-lg p-4 mb-3 flex-row items-center justify-between">
              <View>
                <Text className="text-white font-medium">
                  Weekend/Holiday Rate
                </Text>
                <Text className="text-gray-300 text-sm">
                  Special pricing for weekends
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={updatePricing}
            disabled={saving}
            className="bg-cyan-400 rounded-lg p-4 flex-row items-center justify-center"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Save Pricing
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Help Section */}
          <View className="mt-6 bg-white/5 rounded-xl p-4">
            <Text className="text-white font-medium mb-2">Need Help?</Text>
            <Text className="text-gray-300 text-sm mb-3">
              Pricing strategies can significantly impact your booking success.
              Consider:
            </Text>
            <Text className="text-gray-300 text-sm">
              • Research competitor pricing in your area
            </Text>
            <Text className="text-gray-300 text-sm">
              • Factor in travel time and expenses
            </Text>
            <Text className="text-gray-300 text-sm">
              • Adjust rates based on demand and experience
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
