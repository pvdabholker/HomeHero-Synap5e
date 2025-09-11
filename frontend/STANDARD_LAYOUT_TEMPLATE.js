/**
 * Standard Mobile Layout Template
 * Apply this pattern to all pages for consistency
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function StandardPageTemplate() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#1d1664" />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        {/* Header - Standard across all pages */}
        <View className="px-5 pt-4 pb-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Page Title</Text>
        </View>

        {/* Content - Scrollable area */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        >
          {/* Your page content goes here */}
          <Text className="text-white">Page content</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

/**
 * Key Standards:
 * 1. Always use SafeAreaView with flex-1
 * 2. StatusBar with light-content and #1d1664 background
 * 3. LinearGradient with standard colors
 * 4. Header with pt-4 pb-4 (not pt-14)
 * 5. ScrollView with showsVerticalScrollIndicator={false}
 * 6. Consistent padding: px-5 for header, padding: 16 for content
 * 7. Back button with Ionicons arrow-back size 24
 * 8. Page title with text-xl font-semibold
 */
