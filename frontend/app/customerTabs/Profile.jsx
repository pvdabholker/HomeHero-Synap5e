import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  DeviceEventEmitter,
  BackHandler,
  SafeAreaView,
  StatusBar,
  Alert,
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
      route: "/customerTabs/profilePages/BookingHistory",
    },
    {
      icon: <MaterialIcons name="help-outline" size={26} color="#1d1664" />,
      title: "Help & Support",
      route: "/customerTabs/profilePages/helpAndSupport",
    },
    {
      icon: <MaterialIcons name="settings" size={26} color="#1d1664" />,
      title: "Settings",
      route: "/customerTabs/profilePages/settings",
    },
  ];

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
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

            // Navigate to welcome screen with reset to prevent going back
            router.dismissAll();
            router.replace("/open");
          } catch (error) {
            console.error("Error during logout:", error);
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        {/* Header - Standard with proper margin for transparent status bar */}
        <View className="px-5 pt-12 pb-4 flex-row items-center">
          <Text className="text-white text-xl font-semibold">Profile</Text>
        </View>

        {/* Content - Fixed layout */}
        <View className="flex-1 px-4">
          {/* Profile Header */}
          <View className="items-center mb-8">
            <Image
              source={
                user.avatar_url
                  ? { uri: user.avatar_url }
                  : require("../../assets/images/logo.png")
              }
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <Text className="text-white text-xl font-bold mt-3">
              {user.name || "Guest"}
            </Text>
            <Text className="text-gray-200 text-sm">{user.phone}</Text>

            <TouchableOpacity
              className="mt-3 bg-white/20 px-4 py-2 rounded-lg"
              onPress={() =>
                router.push("/customerTabs/profilePages/EditProfile")
              }
            >
              <Text className="text-white font-semibold text-sm">
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View className="flex-1">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center bg-white rounded-xl shadow-md p-3 mb-3"
                onPress={() => router.push(item.route)}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center">
                  {item.icon}
                </View>
                <Text className="ml-3 text-gray-800 text-base flex-1">
                  {item.title}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color="#1d1664" />
              </TouchableOpacity>
            ))}

            {/* Logout Button */}
            <TouchableOpacity
              className="flex-row items-center bg-red-50 rounded-xl p-3 mt-4"
              onPress={handleLogout}
              disabled={isLoggingOut}
            >
              <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center">
                <MaterialIcons name="logout" size={22} color="red" />
              </View>
              <Text className="ml-3 text-red-600 text-base flex-1">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Version Info */}
          <View className="pb-2">
            <Text className="text-center text-gray-300 text-sm">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
