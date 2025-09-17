import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
  ToastAndroid,
  DeviceEventEmitter,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, TokenStore } from "../../../lib/api";
import { showErrorAlert } from "../../../lib/alerts";

export default function CustomerLogin() {
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [backPressedOnce, setBackPressedOnce] = useState(false);

  // Prevent going back to authenticated pages after logout
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          if (backPressedOnce) {
            BackHandler.exitApp();
            return true;
          } else {
            setBackPressedOnce(true);
            ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
            setTimeout(() => setBackPressedOnce(false), 2000);
            return true;
          }
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [backPressedOnce])
  );
  const router = useRouter();

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      showErrorAlert("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login({
        email_or_phone: emailOrPhone.trim(),
        password,
      });

      // Store auth data from the response
      if (response?.access_token) {
        await AsyncStorage.setItem("token", response.access_token);
        await AsyncStorage.setItem("refresh_token", response.refresh_token);
        await AsyncStorage.setItem("token_type", response.token_type);
        await AsyncStorage.setItem("isLoggedIn", "true");
        if (isChecked) {
          await AsyncStorage.setItem("rememberMe", "true");
        }
        // Store token in TokenStore as well
        TokenStore.token = response.access_token;
      } else {
        throw new Error("Login failed - Invalid response format");
      }

      setLoading(false);

      // Emit event to notify home page that a new user logged in
      DeviceEventEmitter.emit("USER_LOGGED_IN");

      router.replace("/customerTabs/home");
    } catch (error) {
      showErrorAlert(error.message || "Please try again later.");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
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
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View className="flex justify-center items-center mt-20">
              <Image
                source={require("../../../assets/images/login.jpg")}
                className="h-[200px] w-[200px]"
                resizeMode="contain"
              />
            </View>

            {/* Inputs */}
            <View className="mt-14 flex flex-col gap-8">
              <TextInput
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="Phone or Email"
                keyboardType="default"
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
            <View>
              <View className="flex-row items-center m-5">
                <View className="flex-1 h-[1px] bg-gray-800 w-2/3" />
                <Text className="mx-3 text-gray-900">or</Text>
                <View className="flex-1 h-[1px] bg-gray-800" />
              </View>
              <View className="flex-row justify-center items-center mt-4">
                <Text className="text-white">Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => router.push("/auth/customer/customerSignUp")}
                >
                  <Text className="text-[#00EAFF] font-semibold">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
