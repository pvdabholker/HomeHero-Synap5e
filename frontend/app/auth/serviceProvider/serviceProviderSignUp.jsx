import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../lib/api";

export default function ServiceProviderSignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInput = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }
    if (!acceptTerms) {
      Alert.alert("Error", "You must accept the Terms & Conditions");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    setLoading(true);
    try {
      // Store registration data temporarily - don't create account yet
      const registrationData = {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
        user_type: "provider",
      };

      // Store data in AsyncStorage for next steps
      await AsyncStorage.setItem(
        "tempRegistrationData",
        JSON.stringify(registrationData)
      );

      Alert.alert(
        "Information Saved",
        "Your basic information has been saved. Please proceed to complete your profile.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.push("/auth/serviceProvider/profileDetails");
            },
          },
        ]
      );
    } catch (error) {
      // Error saving registration data
      Alert.alert(
        "Error",
        "Failed to save registration data. Please try again."
      );
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
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {/* Image */}
            <View className="flex justify-center items-center">
              <Image
                source={require("../../../assets/images/signup.jpg")}
                className="h-[160px] w-[160px] mt-12"
                resizeMode="contain"
              />
            </View>

            {/* Inputs */}
            <View className="mt-8 flex flex-col gap-5">
              <TextInput
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                secureTextEntry={true}
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                secureTextEntry={true}
                className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
                placeholder="Confirm Password"
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>

            {/* Terms & Conditions */}
            <View className="flex-row items-center w-4/5 mx-auto mt-4">
              <Checkbox
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                color={acceptTerms ? "#00EAFF" : undefined}
                className="h-4 w-4 bg-white"
              />
              <Text className="ml-2 text-white">
                I agree to the{" "}
                <Text className="underline text-[#00EAFF]">
                  Terms & Conditions
                </Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <View className="mt-8">
              <TouchableOpacity
                disabled={loading}
                className={`p-3 w-1/2 m-auto rounded-xl ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
                onPress={handleSignUp}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-medium text-lg">
                    Sign Up
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Redirect to Login */}
            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-white">Already have an account? </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/auth/serviceProvider/serviceProviderLogin")
                }
              >
                <Text className="text-[#00EAFF] font-semibold">Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
