import { View, Text,Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function otpVerify() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input automatically
      if (text && index < 5) {
        inputs.current[index + 1].focus();
      }
    };
  const router = useRouter();
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
      <View className="flex justify-center items-center bg-gradient-to-b mt-10 from-indigo-400 to-indigo-700">
        <Text className="text-4xl font-bold text-white mb-9 underline">
          OTP Verification
        </Text>
        <Text className="text-gray-200 text-lg">
          Enter 6-digit code sent to
        </Text>
        <Text className="text-gray-200 text-lg mb-8">
          your registered phone number
        </Text>

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
      <View className="mt-8">
        <TouchableOpacity
          className="bg-[#00EAFF] p-3 w-1/2 m-auto rounded-xl"
          onPress={() => router.push("/auth/otpVerify")}
        >
          <Text className="text-white text-center font-medium text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center mt-4">
        <TouchableOpacity>
          <Text className="text-[#5c43c1] underline font-semibold">Resend code</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
