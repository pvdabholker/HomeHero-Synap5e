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

export default function ProviderProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    services: [],
    pricing: 0,
    experience_years: 0,
    service_radius: 10,
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeTokens();
      await loadProfile();
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

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [providerProfile, userProfile] = await Promise.all([
        api.providers.me(),
        api.users.me(),
      ]);

      setProfile({
        name: userProfile?.name || "",
        email: userProfile?.email || "",
        phone: userProfile?.phone || "",
        location: userProfile?.location || "",
        services: providerProfile?.services || [],
        pricing: providerProfile?.pricing || 0,
        experience_years: providerProfile?.experience_years || 0,
        service_radius: providerProfile?.service_radius || 10,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);

      // Update user profile
      await api.users.updateMe({
        name: profile.name,
        location: profile.location,
      });

      // Update provider profile
      await api.providers.updateMe({
        services: profile.services,
        pricing: parseFloat(profile.pricing) || 0,
        experience_years: parseInt(profile.experience_years) || 0,
        service_radius: parseFloat(profile.service_radius) || 10,
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    Alert.prompt("Add Service", "Enter service name:", (text) => {
      if (text && text.trim()) {
        setProfile((prev) => ({
          ...prev,
          services: [...prev.services, text.trim()],
        }));
      }
    });
  };

  const removeService = (index) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
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
            <Text className="text-white mt-4">Loading profile...</Text>
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
            Edit Profile
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Basic Information */}
          <Text className="text-white text-lg font-semibold mb-4">
            Basic Information
          </Text>

          <View className="mb-4">
            <Text className="text-gray-200 mb-2">Name</Text>
            <TextInput
              value={profile.name}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, name: text }))
              }
              className="bg-white/20 rounded-lg p-3 text-white"
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-200 mb-2">Email (Read-only)</Text>
            <TextInput
              value={profile.email}
              editable={false}
              className="bg-white/10 rounded-lg p-3 text-gray-400"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-200 mb-2">Phone (Read-only)</Text>
            <TextInput
              value={profile.phone}
              editable={false}
              className="bg-white/10 rounded-lg p-3 text-gray-400"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-200 mb-2">Location</Text>
            <TextInput
              value={profile.location}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, location: text }))
              }
              className="bg-white/20 rounded-lg p-3 text-white"
              placeholder="Your service location"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Services */}
          <Text className="text-white text-lg font-semibold mb-4">
            Services Offered
          </Text>

          {profile.services.map((service, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="flex-1 bg-white/20 rounded-lg p-3 text-white">
                {service}
              </Text>
              <TouchableOpacity
                onPress={() => removeService(index)}
                className="ml-2 p-2"
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={addService}
            className="bg-cyan-400 rounded-lg p-3 mb-6 flex-row items-center justify-center"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Add Service</Text>
          </TouchableOpacity>

          {/* Professional Details */}
          <Text className="text-white text-lg font-semibold mb-4">
            Professional Details
          </Text>

          <View className="mb-4">
            <Text className="text-gray-200 mb-2">Base Pricing (₹/hour)</Text>
            <TextInput
              value={profile.pricing.toString()}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, pricing: text }))
              }
              className="bg-white/20 rounded-lg p-3 text-white"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-200 mb-2">Experience (Years)</Text>
            <TextInput
              value={profile.experience_years.toString()}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, experience_years: text }))
              }
              className="bg-white/20 rounded-lg p-3 text-white"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-200 mb-2">Service Radius (km)</Text>
            <TextInput
              value={profile.service_radius.toString()}
              onChangeText={(text) =>
                setProfile((prev) => ({ ...prev, service_radius: text }))
              }
              className="bg-white/20 rounded-lg p-3 text-white"
              placeholder="10"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={updateProfile}
            disabled={saving}
            className="bg-cyan-400 rounded-lg p-4 flex-row items-center justify-center"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="save" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                  Save Changes
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
