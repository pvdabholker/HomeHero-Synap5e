import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileDetails() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = () => {
    Alert.alert(
      "Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: () => console.log("Camera selected") },
        { text: "Gallery", onPress: () => console.log("Gallery selected") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // 🔹 Backend integration placeholder for profile details
      // const res = await fetch("http://your-backend.com/service-provider-profile", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fullName, contact, serviceType }),
      // });
      // const data = await res.json();
      //
      // if (data.success) {
      //   router.push("/auth/serviceProvider/uploadDocuments");
      // } else {
      //   Alert.alert("Profile Update Failed", data.message);
      // }

      // 🔹 Temporary simulation
      setTimeout(() => {
        setLoading(false);
        router.push("/auth/serviceProvider/uploadDocuments");
      }, 1500);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
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
      {/* Title */}
      <View className="flex justify-center items-center mt-24">
        <Text className="text-2xl font-bold text-white">Set Your Profile</Text>
      </View>

      {/* Profile Picture */}
      <View className="flex justify-center items-center mt-8">
        <TouchableOpacity
          onPress={handleImageUpload}
          className="relative"
        >
          <View className="w-32 h-32 rounded-full bg-gray-300 items-center justify-center">
            <Ionicons name="person" size={60} color="white" />
          </View>
          <View className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 rounded-full items-center justify-center">
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View className="mt-12 flex flex-col gap-6 px-8">
        {/* Full Name */}
        <View>
          <Text className="text-black text-base mb-2 font-medium">Full Name</Text>
          <TextInput
            className="w-full h-12 rounded-lg pl-4 bg-[#E5DFDF]"
            placeholder="Enter your full name"
            placeholderTextColor="#666666"
            value={fullName}
            onChangeText={setFullName}
            style={{ color: 'black' }}
          />
        </View>

        {/* Contact */}
        <View>
          <Text className="text-black text-base mb-2 font-medium">Contact</Text>
          <TextInput
            className="w-full h-12 rounded-lg pl-4 bg-[#E5DFDF]"
            placeholder="Enter your contact number"
            placeholderTextColor="#666666"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
            style={{ color: 'black' }}
          />
        </View>

        {/* Service Type */}
        <View>
          <Text className="text-black text-base mb-2 font-medium">Service Type</Text>
          <TouchableOpacity
            className="w-full h-12 rounded-lg pl-4 bg-[#E5DFDF] flex-row items-center justify-between pr-4"
            onPress={() => Alert.alert("Service Type", "Dropdown will be implemented with backend")}
          >
            <Text className={`${serviceType ? "text-black" : "text-gray-500"}`} style={{ color: serviceType ? 'black' : '#666666' }}>
              {serviceType || "Select service type"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Button */}
      <View className="mt-12 px-8">
        <TouchableOpacity
          disabled={loading}
          className={`p-4 w-full rounded-xl ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
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
    </LinearGradient>
  );
}
