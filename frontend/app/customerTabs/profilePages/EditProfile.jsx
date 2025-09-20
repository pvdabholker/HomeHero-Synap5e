import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  DeviceEventEmitter,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../../lib/api";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [loading, setLoading] = useState(false);

  // Handle hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push("/customerTabs/Profile");
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    (async () => {
      try {
        const me = await api.users.me();
        setName(me?.name || "");
        setPhone(me?.phone || "");
        setEmail(me?.email || "");
        if (me?.avatar_url) {
          setProfilePic({ uri: me.avatar_url });
        }
      } catch (e) {
        // ignore; may be unauthenticated at this point
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePic({ uri });
      try {
        const res = await api.users.uploadAvatar({ uri, name: "avatar.jpg" });
        const newUrl = res?.avatar_url || uri;

        // Set global timestamp to prevent immediate reload
        global.lastAvatarUpdateTime = Date.now();

        DeviceEventEmitter.emit("USER_AVATAR_UPDATED", { avatar_url: newUrl });
        Alert.alert("Updated", "Profile photo updated successfully");
      } catch (e) {
        Alert.alert("Upload failed", e.message || "Could not upload photo");
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.users.updateMe({ name, phone, email });
      DeviceEventEmitter.emit("USER_PROFILE_UPDATED", { name, phone, email });

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
          Alert.alert("Password", "Please fill all password fields.");
        } else if (newPassword !== confirmPassword) {
          Alert.alert("Password", "New passwords do not match.");
        } else {
          Alert.alert(
            "Password",
            "Password change isn't available yet in the API. Your name, phone, and email have been updated."
          );
        }
      } else {
        Alert.alert("Profile Updated", "Your profile changes have been saved.");
      }

      router.push("/customerTabs/Profile");
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong.");
      console.error(error);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 56,
            paddingBottom: 100, // Extra bottom padding to ensure button is visible above nav bar
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Picture */}
          <View className="items-center mb-8">
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  profilePic || require("../../../assets/images/avatar.png")
                }
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

          <Text className="text-white mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-white rounded-xl p-3 mb-6 text-gray-800"
          />

          <Text className="text-white mb-2">Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            className="bg-white rounded-xl p-3 mb-6 text-gray-800"
          />

          {/* Password Section */}
          <Text className="text-white mb-2">Current Password</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            className="bg-white rounded-xl p-3 mb-4 text-gray-800"
          />
          <Text className="text-white mb-2">New Password</Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            className="bg-white rounded-xl p-3 mb-4 text-gray-800"
          />
          <Text className="text-white mb-2">Confirm New Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            className="bg-white rounded-xl p-3 mb-6 text-gray-800"
          />

          {/* Save Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl mt-4 ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="text-center text-white text-lg font-semibold">
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/customerTabs/Profile")}
          >
            <Text className="text-center text-gray-200">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
