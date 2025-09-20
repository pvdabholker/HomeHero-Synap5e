import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, TokenStore } from "../../lib/api";

export default function AdminLogin() {
  const router = useRouter();

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneOrEmail || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      // Call the backend login API for admin authentication
      const response = await api.auth.login({
        email_or_phone: phoneOrEmail.trim(),
        password: password.trim(),
      });

      if (response && response.access_token) {
        // Store the authentication token
        await AsyncStorage.setItem("access_token", response.access_token);
        await AsyncStorage.setItem(
          "token_type",
          response.token_type || "Bearer"
        );

        // Set token in TokenStore for immediate use
        TokenStore.setTokens({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        });

        // Verify this is an admin user
        try {
          const userProfile = await api.users.me();

          if (userProfile.user_type !== "admin") {
            Alert.alert(
              "Access Denied",
              "This login is only for admin users. Please use the appropriate login page."
            );
            // Clear stored data
            await AsyncStorage.multiRemove(["access_token", "token_type"]);
            TokenStore.clear();
            setLoading(false);
            return;
          }

          // Store admin information
          await AsyncStorage.setItem("userType", "admin");
          await AsyncStorage.setItem("userName", userProfile.name || "Admin");
          await AsyncStorage.setItem("userEmail", userProfile.email || "");
          await AsyncStorage.setItem("userId", userProfile.id || "");
          await AsyncStorage.setItem("isLoggedIn", "true");

          Alert.alert("Success", "Admin login successful!", [
            {
              text: "OK",
              onPress: () => {
                router.dismissAll();
                router.replace("../admintabs/AdminDashboard");
              },
            },
          ]);
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          Alert.alert(
            "Error",
            "Failed to load admin profile. Please try again."
          );
        }
      } else {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Admin login error:", error);

      let errorMessage = "Something went wrong. Please try again.";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email/phone or password.";
        } else if (error.response.status === 404) {
          errorMessage = "Account not found. Please check your credentials.";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 w-full"
        >
          <ScrollView
            className="flex-1 w-full"
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="bg-white w-80 p-6 rounded-2xl shadow-lg mx-4">
              <Text className="text-center text-xl font-semibold mb-6">
                Admin Log in
              </Text>

              <TextInput
                placeholder="Phone Number or Email"
                value={phoneOrEmail}
                onChangeText={setPhoneOrEmail}
                className="bg-gray-200 px-4 py-3 rounded-lg mb-4"
                keyboardType="email-address"
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                className="bg-gray-200 px-4 py-3 rounded-lg mb-6"
                secureTextEntry={true}
              />

              <TouchableOpacity
                disabled={loading}
                className={`py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-cyan-400"}`}
                onPress={handleLogin}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-white font-semibold text-lg">
                    Log in
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
