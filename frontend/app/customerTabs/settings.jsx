import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace("../components/open");
        },
      },
    ]);
  };

  const settingsSections = [
    {
      title: "Notifications",
      items: [
        {
          title: "Push Notifications",
          icon: "notifications",
          type: "toggle",
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          title: "Email Updates",
          icon: "mail",
          type: "toggle",
          value: emailUpdates,
          onValueChange: setEmailUpdates,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          title: "Dark Mode",
          icon: "moon",
          type: "toggle",
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          title: "Language",
          icon: "language",
          type: "select",
          value: "English",
          onPress: () =>
            Alert.alert(
              "Coming Soon",
              "Language options will be available soon"
            ),
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          title: "Location Services",
          icon: "location",
          type: "toggle",
          value: locationServices,
          onValueChange: setLocationServices,
        },
        {
          title: "Privacy Policy",
          icon: "shield-checkmark",
          type: "link",
          onPress: () =>
            Alert.alert("Privacy Policy", "Opens privacy policy page"),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Change Password",
          icon: "key",
          type: "link",
          onPress: () =>
            Alert.alert("Change Password", "Opens password change form"),
        },
        {
          title: "Delete Account",
          icon: "trash",
          type: "danger",
          onPress: () =>
            Alert.alert(
              "Delete Account",
              "Are you sure you want to delete your account?"
            ),
        },
      ],
    },
  ];

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-5 pt-12 flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-3">Settings</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 34 }}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-6">
            <Text className="text-white text-lg font-semibold mb-3">
              {section.title}
            </Text>
            <View className="bg-white/20 rounded-xl overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  className={`p-4 flex-row items-center justify-between ${
                    itemIndex < section.items.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                  onPress={
                    item.type === "link" || item.type === "select"
                      ? item.onPress
                      : undefined
                  }
                >
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.type === "danger" ? "#ff4444" : "#00EAFF"}
                    />
                    <Text
                      className={`ml-3 ${
                        item.type === "danger" ? "text-red-400" : "text-white"
                      }`}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {item.type === "toggle" ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: "#767577", true: "#00EAFF" }}
                      thumbColor={item.value ? "#fff" : "#f4f3f4"}
                    />
                  ) : item.type === "select" ? (
                    <View className="flex-row items-center">
                      <Text className="text-gray-300 mr-2">{item.value}</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="white"
                      />
                    </View>
                  ) : item.type === "link" || item.type === "danger" ? (
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
