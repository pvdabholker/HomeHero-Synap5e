import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../../lib/api";

export default function BookService() {
  const params = useLocalSearchParams();
  const initialCategory =
    typeof params.category === "string" ? params.category : "";
  const [selected, setSelected] = useState(initialCategory || "");
  const [services, setServices] = useState([]);

  const iconFor = useMemo(
    () => ({
      electrical: (
        <MaterialCommunityIcons name="lightning-bolt" size={28} color="black" />
      ),
      electrician: (
        <MaterialCommunityIcons name="lightning-bolt" size={28} color="black" />
      ),
      plumbing: <MaterialCommunityIcons name="pipe" size={28} color="black" />,
      plumber: <MaterialCommunityIcons name="pipe" size={28} color="black" />,
      cleaning: <FontAwesome5 name="broom" size={26} color="black" />,
      cleaner: <FontAwesome5 name="broom" size={26} color="black" />,
      paint: <MaterialIcons name="format-paint" size={26} color="black" />,
      painter: <MaterialIcons name="format-paint" size={26} color="black" />,
      laundry: <FontAwesome5 name="tshirt" size={24} color="black" />,
      carpentry: (
        <MaterialCommunityIcons name="saw-blade" size={28} color="black" />
      ),
      carpenter: (
        <MaterialCommunityIcons name="saw-blade" size={28} color="black" />
      ),
      technician: <Ionicons name="construct" size={28} color="black" />,
      ac_technician: (
        <MaterialCommunityIcons
          name="air-conditioner"
          size={28}
          color="black"
        />
      ),
      gardener: (
        <MaterialCommunityIcons name="flower" size={28} color="black" />
      ),
      gardening: (
        <MaterialCommunityIcons name="flower" size={28} color="black" />
      ),
      default: <Ionicons name="construct" size={28} color="black" />,
    }),
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const items = await api.services.getAll();
        setServices(items || []);
      } catch (e) {
        setServices([]);
      }
    })();
  }, []);

  const onContinue = () => {
    if (!selected) {
      Alert.alert("Please select a service");
      return;
    }
    router.push({
      pathname: "/customerTabs/bookSteps/bookStep2",
      params: { service: selected },
    });
  };

  // Go back to home (since this is step 1)
  const goBackToHome = () => {
    router.replace("/customerTabs/home");
  };

  // Handle hardware/system back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goBackToHome();
        return true; // prevent default
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1 px-4 pt-12"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={goBackToHome}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="ml-3 text-lg font-semibold text-white">
          Book a Service
        </Text>
      </View>

      {/* Steps */}
      <View className="flex-row justify-between items-center mb-6">
        {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
          <View key={index} className="items-center flex-1">
            <View
              className={`w-3 h-3 rounded-full ${
                index === 0 ? "bg-cyan-400" : "bg-white/50"
              }`}
            />
            <Text className="text-xs text-white mt-2">{step}</Text>
            <Text className="text-[10px] text-white/70">
              {
                ["Select Services", "Location", "Pick Provider", "Summary"][
                  index
                ]
              }
            </Text>
          </View>
        ))}
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-white/40 mb-6" />

      {/* Question */}
      <Text className="text-white text-base font-medium mb-4">
        What kind of service do you need?
      </Text>

      {/* Service Options */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {services.map((item, index) => {
          const name = item?.name || "";
          const key = name.toLowerCase();
          const icon = iconFor[key] || iconFor.default;
          return (
            <TouchableOpacity
              key={`${key}-${index}`}
              onPress={() => setSelected(name)}
              className={`flex-row items-center justify-center py-6 rounded-xl mb-4 ${
                selected === name ? "bg-white" : "bg-white/20"
              }`}
            >
              <View className="mr-3">{icon}</View>
              <Text
                className={`text-lg ${
                  selected === name ? "text-black font-semibold" : "text-white"
                }`}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity className="mt-auto mb-12" onPress={onContinue}>
        <LinearGradient
          colors={["#00c6ff", "#00aaff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="py-4 rounded-xl"
        >
          <Text className="text-center text-white text-base font-semibold">
            Continue
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}
