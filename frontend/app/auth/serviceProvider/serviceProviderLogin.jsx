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
} from "react-native";
import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage"; // uncomment when integrating

export default function ServiceProviderLogin() {
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Placeholder API call for service provider login
      // const res = await fetch("http://your-backend.com/service-provider-login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ phone, password }),
      // });
      // const data = await res.json();
      //
      // if (data.success) {
      //   if (isChecked) {
      //     await AsyncStorage.setItem("sp_token", data.token);
      //   }
      //   router.push("/auth/serviceProvider/otpVerify");
      // } else {
      //   Alert.alert("Login Failed", data.message);
      // }

      // 🔹 Temporary simulation
      setTimeout(() => {
        setLoading(false);
        router.push("/auth/serviceProvider/otpVerify");
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
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
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
            Alert.alert("Forgot Password", "Will integrate with backend later")
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
            onPress={() => router.push("/auth/serviceProvider/serviceProviderSignUp")}
          >
            <Text className="text-[#00EAFF] font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}