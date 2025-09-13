import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UploadDocuments() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBrowseFiles = () => {
    Alert.alert(
      "Upload Documents",
      "Choose an option",
      [
        { text: "Camera", onPress: () => console.log("Camera selected") },
        { text: "Gallery", onPress: () => console.log("Gallery selected") },
        { text: "Files", onPress: () => console.log("Files selected") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      // 🔹 Backend integration placeholder for document upload
      // const res = await fetch("http://your-backend.com/upload-documents", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ documents: [] }),
      // });
      // const data = await res.json();
      //
      // if (data.success) {
      //   router.push("/auth/otpVerify");
      // } else {
      //   Alert.alert("Upload Failed", data.message);
      // }

      // 🔹 Temporary simulation
      setTimeout(() => {
        setLoading(false);
        router.push("/auth/otpVerify");
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
        <Text className="text-2xl font-bold text-white">Upload Your Documents</Text>
      </View>

      {/* Upload Area */}
      <View className="mt-12 mx-8">
        <View className="bg-white rounded-2xl p-6 items-center justify-center">
          {/* Document Icon with Plus */}
          <View className="items-center mb-4">
            <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mb-2">
              <Ionicons name="document-text" size={24} color="#666666" />
            </View>
            <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full items-center justify-center">
              <Ionicons name="add" size={12} color="white" />
            </View>
          </View>

          {/* Upload Text */}
          <Text className="text-gray-600 text-base font-medium text-center mb-4">
            Drag files here or click to upload
          </Text>

          {/* Browse Files Button */}
          <TouchableOpacity
            onPress={handleBrowseFiles}
            className="bg-[#00EAFF] rounded-xl py-3 px-6"
          >
            <Text className="text-white text-base font-semibold">Browse Files</Text>
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
