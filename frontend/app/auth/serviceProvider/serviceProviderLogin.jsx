import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, TokenStore } from "../../../lib/api";

export default function ServiceProviderLogin() {
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateInput = () => {
    if (!emailOrPhone.trim()) {
      Alert.alert("Error", "Please enter your email or phone number");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      // Call the backend login API using the structured api object
      const response = await api.auth.login({
        email_or_phone: emailOrPhone.trim(),
        password: password.trim(),
      });

      if (response && response.access_token) {
        // Store the authentication token
        await AsyncStorage.setItem("access_token", response.access_token);
        await AsyncStorage.setItem(
          "token_type",
          response.token_type || "Bearer"
        );

        // Store login state and remember me preference
        await AsyncStorage.setItem("isLoggedIn", "true");
        if (isChecked) {
          await AsyncStorage.setItem("rememberMe", "true");
        }

        // Get user profile to verify it's a service provider
        try {
          const userProfile = await api.users.me();

          if (userProfile.user_type !== "provider") {
            Alert.alert(
              "Access Denied",
              "This login is only for service providers. Please use the customer login."
            );
            // Clear stored data
            await AsyncStorage.multiRemove([
              "access_token",
              "token_type",
              "isLoggedIn",
            ]);
            setLoading(false);
            return;
          }

          // Store user information
          await AsyncStorage.setItem("userType", "provider");
          await AsyncStorage.setItem(
            "userName",
            userProfile.name || "Provider"
          );
          await AsyncStorage.setItem("userEmail", userProfile.email || "");
          await AsyncStorage.setItem("userId", userProfile.id || "");

          // Emit event to notify app about login
          DeviceEventEmitter.emit("USER_LOGGED_IN", {
            userType: "provider",
            userName: userProfile.name,
          });

          Alert.alert("Success", "Login successful!", [
            {
              text: "OK",
              onPress: () => {
                router.dismissAll();
                router.replace("/serviceProviderTabs/home");
              },
            },
          ]);
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          Alert.alert(
            "Error",
            "Failed to load user profile. Please try again."
          );
        }
      } else {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          errorMessage = "Invalid email/phone or password.";
        } else if (error.response.status === 404) {
          errorMessage = "Account not found. Please check your credentials.";
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        // Network error
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      Alert.alert("Login Failed", errorMessage);
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="flex justify-center items-center">
            <Image
              source={require("../../../assets/images/login.jpg")}
              className="h-[200px] w-[200px] mt-24"
              resizeMode="contain"
            />
          </View>

          {/* Inputs */}
          <View className="mt-14 flex flex-col gap-8">
            <TextInput
              className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
              placeholder="Email or Phone Number"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
            />
            <TextInput
              secureTextEntry={true}
              className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Remember Me + Forgot Password */}
          <View className="flex-row justify-between mt-4 px-10 items-center">
            <View className="flex-row items-center">
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? "#00EAFF" : undefined}
                className="bg-[#E5DFDF] h-4 w-4"
              />
              <Text className="text-white ml-2">Remember me</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Forgot Password",
                  "Will integrate with backend later"
                )
              }
            >
              <Text className="text-white underline">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <View className="mt-8">
            <TouchableOpacity
              disabled={loading}
              className={`p-3 w-1/2 m-auto rounded-xl ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-medium text-lg">
                  Log in
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider + Signup */}
          <View className="mt-8 mb-8">
            <View className="flex-row items-center m-5">
              <View className="flex-1 h-[1px] bg-gray-800 w-2/3" />
              <Text className="mx-3 text-gray-900">or</Text>
              <View className="flex-1 h-[1px] bg-gray-800" />
            </View>
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-white">Don't have an account? </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/auth/serviceProvider/serviceProviderSignUp")
                }
              >
                <Text className="text-[#00EAFF] font-semibold">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
