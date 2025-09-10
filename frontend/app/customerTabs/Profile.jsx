import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  BackHandler,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../../lib/api";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    avatar_url: "",
  });

  const loadMe = useCallback(async () => {
    try {
      const me = await api.users.me();
      setUser({
        name: me?.name || "",
        phone: me?.phone || "",
        avatar_url: me?.avatar_url || "",
      });
    } catch (e) {
      setUser({ name: "Guest", phone: "", avatar_url: "" });
    }
  }, []);

  useEffect(() => {
    loadMe();
    const sub1 = DeviceEventEmitter.addListener(
      "USER_AVATAR_UPDATED",
      ({ avatar_url }) => {
        setUser((u) => ({ ...u, avatar_url }));
      }
    );
    const sub2 = DeviceEventEmitter.addListener(
      "USER_PROFILE_UPDATED",
      ({ name }) => {
        if (name) setUser((u) => ({ ...u, name }));
      }
    );
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, [loadMe]);

  useFocusEffect(
    useCallback(() => {
      loadMe();
    }, [loadMe])
  );

  const menuItems = [
    {
      icon: <MaterialIcons name="history" size={26} color="#1d1664" />,
      title: "Booking History",
      route: "/customerTabs/BookingHistory",
    },
    {
      icon: <Ionicons name="notifications-outline" size={26} color="#1d1664" />,
      title: "Notifications",
      route: "/customerTabs/notification",
    },
    {
      icon: <MaterialIcons name="help-outline" size={26} color="#1d1664" />,
      title: "Help & Support",
      route: "/customerTabs/helpAndSupport",
    },
    {
      icon: <MaterialIcons name="settings" size={26} color="#1d1664" />,
      title: "Settings",
      route: "/customerTabs/settings",
    },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Clear all storage and update login state
      await AsyncStorage.clear();
      await AsyncStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);

      // Reset user state
      setUser({
        name: "",
        phone: "",
        avatar_url: "",
      });

      // Navigate to login
      router.replace("/auth/customer/customerLogin");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-6 pt-14 items-center">
          <Image
            source={
              user.avatar_url
                ? { uri: user.avatar_url }
                : require("../../assets/images/logo.png")
            }
            className="w-28 h-28 rounded-full border-4 border-white"
          />
          <Text className="text-white text-2xl font-bold mt-4">
            {user.name || "Guest"}
          </Text>
          <Text className="text-gray-200">{user.phone}</Text>

          <TouchableOpacity
            className="absolute top-16 right-6 bg-white/20 p-2 rounded-full"
            onPress={() => router.push("/customerTabs/EditProfile")}
          >
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-4 mt-10">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center bg-white rounded-xl shadow-md p-4 mb-4"
              onPress={() => router.push(item.route)}
            >
              <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
                {item.icon}
              </View>
              <Text className="ml-4 text-gray-800 text-lg flex-1">
                {item.title}
              </Text>
              <MaterialIcons name="chevron-right" size={26} color="#1d1664" />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row items-center bg-red-50 rounded-xl p-4 mt-6"
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            <View className="w-12 h-12 bg-red-100 rounded-lg items-center justify-center">
              <MaterialIcons name="logout" size={26} color="red" />
            </View>
            <Text className="ml-4 text-red-600 text-lg flex-1">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text className="text-center text-gray-300 py-6">Version 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}
