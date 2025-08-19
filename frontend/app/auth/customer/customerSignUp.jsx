import { View, Text,Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function customerSignUp() {
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
          source={require("../../../assets/images/signup.jpg")}
          className="h-[200px] w-[200px] mt-24"
          resizeMode="contain"
        />
      </View>
      <View className="mt-14 flex flex-col gap-8">
        <TextInput
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="Full Name"
        />
        <TextInput
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="Phone Number"
        />
        <TextInput
          secureTextEntry={true}
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="New Password"
        />
        <TextInput
          secureTextEntry={true}
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="Confirm Password"
        />
      </View>
      <View className="mt-8">
        <TouchableOpacity className="bg-[#00EAFF] p-3 w-1/2 m-auto rounded-xl" onPress={() => router.push("/auth/otpVerify")}>
          <Text className="text-white text-center font-medium text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-white">Already have an account? </Text>
        <TouchableOpacity
          onPress={() => router.push("/auth/customer/customerLogin")}
        >
          <Text className="text-[#00EAFF] font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
