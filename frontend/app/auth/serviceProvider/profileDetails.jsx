import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../../lib/api";

export default function ProfileDetails() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!contact.trim()) {
      Alert.alert("Error", "Please enter your contact information");
      return false;
    }
    if (!serviceType.trim()) {
      Alert.alert("Error", "Please specify your service type");
      return false;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter your service location");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      const providerData = {
        services: [serviceType.trim()],
        pricing: parseFloat(hourlyRate) || 0,
        experience_years: parseInt(experience) || 0,
        service_radius: 10,
      };

      const response = await api.providers.create(providerData);

      if (response && response.provider_id) {
        try {
          await api.users.updateMe({
            name: fullName.trim(),
            location: location.trim(),
          });
        } catch (userUpdateError) {
          console.error("User profile update error:", userUpdateError);
        }

        Alert.alert("Success!", "Provider profile created successfully.", [
          {
            text: "Continue",
            onPress: () => router.push("/auth/serviceProvider/uploadDocuments"),
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to create provider profile.");
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
        <View className="mt-16">
          <Text className="text-white text-2xl font-bold text-center mb-8">
            Complete Your Profile
          </Text>

          <View className="space-y-6">
            <View>
              <Text className="text-white mb-2">Full Name</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Contact Number</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                value={contact}
                onChangeText={setContact}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Service Type</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="e.g., Plumber, Electrician"
                value={serviceType}
                onChangeText={setServiceType}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Service Location</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="City, State"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Experience (Years)</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="Years of experience"
                keyboardType="numeric"
                value={experience}
                onChangeText={setExperience}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Hourly Rate (₹)</Text>
              <TextInput
                className="bg-white rounded-lg p-3"
                placeholder="Your hourly rate"
                keyboardType="numeric"
                value={hourlyRate}
                onChangeText={setHourlyRate}
              />
            </View>
          </View>

          <TouchableOpacity
            disabled={loading}
            className={`mt-8 p-4 rounded-xl ${loading ? "bg-gray-400" : "bg-cyan-400"}`}
            onPress={handleContinue}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-medium text-lg">
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
