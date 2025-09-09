import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { api, TokenStore } from "../../lib/api";

export default function OtpVerify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);
  const router = useRouter();

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input automatically
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    const phone = TokenStore.getLastPhone();
    if (!phone) {
      Alert.alert("Missing phone", "Please login or signup again.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.verifyOtp({ phone, otp: enteredOtp });
      setLoading(false);
      router.push("/customerTabs/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Invalid OTP", error.message || "Please try again later.");
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
      <View className="flex justify-center items-center">
        <Image
          source={require("../../assets/images/otp.jpg")}
          className="h-[200px] w-[200px] mt-24"
          resizeMode="contain"
        />
      </View>

      <View className="flex justify-center items-center mt-10">
        <Text className="text-4xl font-bold text-white mb-9 underline">
          OTP Verification
        </Text>
        <Text className="text-gray-200 text-lg">
          Enter 6-digit code sent to
        </Text>
        <Text className="text-gray-200 text-lg mb-8">
          your registered phone number
        </Text>

        {/* OTP Inputs */}
        <View className="flex-row space-x-3">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              className="w-12 h-12 text-xl font-bold text-center rounded-md bg-white m-1"
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View className="mt-8">
        <TouchableOpacity
          disabled={loading}
          className={`p-3 w-1/2 m-auto rounded-xl ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
          onPress={handleSubmit}
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

      {/* Resend Code */}
      <View className="flex-row justify-center items-center mt-4">
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Resend OTP", "Will integrate with backend later")
          }
        >
          <Text className="text-[#5c43c1] underline font-semibold">
            Resend code
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
