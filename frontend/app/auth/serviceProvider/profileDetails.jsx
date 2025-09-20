import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [registrationData, setRegistrationData] = useState(null);

  // Load registration data from previous step
  React.useEffect(() => {
    const loadRegistrationData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("tempRegistrationData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setRegistrationData(parsedData);
          setFullName(parsedData.name || "");
          setContact(parsedData.phone || "");
        } else {
          // Redirect back to signup if no data found
          Alert.alert(
            "Error",
            "Registration data not found. Please start the signup process again.",
            [
              {
                text: "OK",
                onPress: () =>
                  router.push("/auth/serviceProvider/serviceProviderSignUp"),
              },
            ]
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load registration data.");
      }
    };
    loadRegistrationData();
  }, []);

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
      // Combine registration data with profile data
      const completeData = {
        ...registrationData,
        profileDetails: {
          fullName: fullName.trim(),
          contact: contact.trim(),
          serviceType: serviceType.trim(),
          location: location.trim(),
          experience: experience.trim(),
          hourlyRate: hourlyRate.trim(),
          services: [serviceType.trim()],
          pricing: parseFloat(hourlyRate) || 0,
          experience_years: parseInt(experience) || 0,
          service_radius: 10,
        },
      };

      // Save complete data for document upload step
      await AsyncStorage.setItem(
        "tempCompleteData",
        JSON.stringify(completeData)
      );

      Alert.alert(
        "Profile Saved!",
        "Your profile details have been saved. Please upload required documents to complete registration.",
        [
          {
            text: "Continue",
            onPress: () => router.push("/auth/serviceProvider/uploadDocuments"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
        >
          <ScrollView
            className="flex-1 px-8"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <View className="mt-8">
              <Text className="text-white text-2xl font-bold text-center mb-6">
                Complete Your Profile
              </Text>

              <View className="space-y-4 gap-4">
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
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
