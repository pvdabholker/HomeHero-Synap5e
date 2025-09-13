import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";

export default function ServiceProviderSignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !phone || !email || !password || !confirm) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      Alert.alert("Error", "You must accept the Terms & Conditions");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Backend integration placeholder for service provider signup
      // const res = await fetch("http://your-backend.com/service-provider-signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ fullName, phone, email, password }),
      // });
      // const data = await res.json();
      //
      // if (data.success) {
      //   router.push("/auth/serviceProvider/profileDetails");
      // } else {
      //   Alert.alert("Sign Up Failed", data.message);
      // }

      // 🔹 Temporary simulation
      setTimeout(() => {
        setLoading(false);
        router.push("/auth/serviceProvider/profileDetails");
      }, 1500);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
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
      {/* Image */}
      <View className="flex justify-center items-center">
        <Image
          source={require("../../../assets/images/signup.jpg")}
          className="h-[200px] w-[200px] mt-24"
          resizeMode="contain"
        />
      </View>


      {/* Inputs */}
      <View className="mt-14 flex flex-col gap-6">
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
          <Text className="underline text-[#00EAFF]">Terms & Conditions</Text>
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
          onPress={() => router.push("/auth/serviceProvider/serviceProviderLogin")}
        >
          <Text className="text-[#00EAFF] font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
