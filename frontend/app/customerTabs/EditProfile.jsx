import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function EditProfile() {
  const router = useRouter();

  // 🔹 Local state (fetched from backend later)
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [profilePic, setProfilePic] = useState(
    require("../../assets/images/logo.png")
  );

  // 🔹 Handle Image Upload
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic({ uri: result.assets[0].uri });
    }
  };

  // 🔹 Save handler (connect backend later)
  const handleSave = async () => {
    try {
      // Example API call
      /*
      const res = await fetch("http://your-backend.com/api/user/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      */

      Alert.alert("Profile Updated", "Your profile changes have been saved.");
      router.back(); // Go back to Profile page
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 px-6 pt-14">
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={profilePic}
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <Text className="text-white mt-2 underline">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <Text className="text-white mb-2">Full Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-white rounded-xl p-3 mb-6 text-gray-800"
        />

        <Text className="text-white mb-2">Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          className="bg-white rounded-xl p-3 mb-6 text-gray-800"
        />

        {/* Save Button */}
        <TouchableOpacity
          className="bg-[#00EAFF] py-4 rounded-xl mt-4"
          onPress={handleSave}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Save Changes
          </Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <Text className="text-center text-gray-200">Cancel</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
