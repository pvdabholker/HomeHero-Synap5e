import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function customerLogin() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <View className="flex justify-center items-center">
        <Image
          source={require("../../../assets/images/login.jpg")}
          className="h-[200px] w-[200px] mt-24"
          resizeMode="contain"
        />
      </View>
      <View className="mt-14 flex flex-col gap-8">
        <TextInput
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="Phone Number"
        />
        <TextInput
          secureTextEntry={true}
          className="w-4/5 h-12 rounded-2xl m-auto pl-4 bg-[#E5DFDF]"
          placeholder="Password"
        />
      </View>

      <View className="flex-row justify-between mt-4 px-10 items-center">
        <View className="flex-row items-center">
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? "#00EAFF" : undefined}
            className="bg-[#E5DFDF] h-4 w-4"
          />
          <Text className="text-white">Remember me</Text>
        </View>
        <Text className="text-white">Forgot Password?</Text>
      </View>

      <View className="mt-8">
        <TouchableOpacity className="bg-[#00EAFF] p-3 w-1/2 m-auto rounded-xl">
          <Text className="text-white text-center font-medium text-lg">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
