import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from "expo-router";


export default function open() {
  const router=useRouter();
  return (
      <View className="">
        <Image
          source={require("./../assets/images/logo.png")}
          className="w-full h-[50%] rounded-b-3xl"
        />
        <View className="flex flex-col gap-32 items-center">
          <Text className="font-bold text-5xl mt-12">WELCOME!</Text>
          <View className="flex flex-col gap-7 items-center w-full">
            <TouchableOpacity
              onPress={() => router.push("./auth/customer/customerLogin")}
              className="bg-[#00EAFF] p-3 w-2/3 rounded-2xl"
            >
              <Text className="color-white text-center font-medium text-lg">
                Continue as Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push("./auth/serviceProvider/serviceProviderLogin")
              }
              className="bg-[#00EAFF] p-3 w-2/3 rounded-2xl"
            >
              <Text className="color-white text-center font-medium text-lg">
                Continue as Service Provider
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
}