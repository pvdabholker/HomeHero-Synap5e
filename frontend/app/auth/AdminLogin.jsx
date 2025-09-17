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
      // 🔹 Placeholder for backend integration
      // Example:
      // const res = await fetch("http://your-backend.com/admin/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ phone, password }),
      // });
      // const data = await res.json();
      // if (data.success) {
      //   router.push("../admintabs/AdminDashboard");
      // } else {
      //   Alert.alert("Login Failed", data.message);
      // }

      // Temporary success simulation
      setTimeout(() => {
        setLoading(false);
        router.push("../admintabs/AdminDashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Try again later.");
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
