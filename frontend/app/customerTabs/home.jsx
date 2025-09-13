import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const categories = [
    {
      name: "Electrical",
      icon: (
        <MaterialCommunityIcons name="lightning-bolt" size={28} color="black" />
      ),
    },
    {
      name: "Plumbing",
      icon: <MaterialCommunityIcons name="pipe" size={28} color="black" />,
    },
    {
      name: "Cleaning",
      icon: <FontAwesome5 name="broom" size={26} color="black" />,
    },
    {
      name: "Paint",
      icon: <MaterialIcons name="format-paint" size={26} color="black" />,
    },
    {
      name: "Laundry",
      icon: <FontAwesome5 name="tshirt" size={24} color="black" />,
    },
    {
      name: "Carpentry",
      icon: <MaterialCommunityIcons name="saw-blade" size={28} color="black" />,
    },
    {
      name: "Technician",
      icon: <Ionicons name="construct" size={28} color="black" />,
    },
    { name: "More", icon: <Ionicons name="grid" size={28} color="black" /> },
  ];

  const handleSearch = () => {
    // 🔹 Later you can call backend search API
    // Example:
    // fetch(`http://your-backend.com/services?query=${search}`)
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    console.log("Searching for:", search);
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-5 pt-14 flex-row items-center space-x-3">
        <Image
          // source={require("../../../assets/images/profile.png")}
          className="w-12 h-12 rounded-full bg-gray-300"
        />
        <View>
          <Text className="text-white font-semibold mx-2">Hello, John</Text>
          <View className="flex-row items-center space-x-1 mx-2">
            <Ionicons name="location-sharp" size={14} color="white" />
            <Text className="text-white text-sm">Goa</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-4">
        <View className="bg-white flex-row items-center px-3 py-2 rounded-lg">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search your services"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            className="flex-1 ml-2 text-gray-700"
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView className="px-4 mt-6">
        <Text className="text-lg font-semibold text-white">Categories</Text>
        <View className="flex-row flex-wrap mt-4">
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-1/4 items-center mb-6"
              onPress={() =>
                router.push(
                  `/customerTabs/bookSteps/bookStep1?category=${item.name}`
                )
              }
            >
              <View className="w-16 h-16 rounded-lg bg-white shadow items-center justify-center">
                {item.icon}
              </View>
              <Text className="mt-2 text-sm text-white">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View className="flex-row justify-around py-3 bg-white border-t border-gray-200 pb-8">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/customerTabs/bookSteps/bookStep1")}
        >
          <Ionicons name="book" size={24} color="black" />
          <Text className="text-xs">Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/customerTabs/Profile")}
        >
          <Ionicons name="person" size={24} color="black" />
          <Text className="text-xs">Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
