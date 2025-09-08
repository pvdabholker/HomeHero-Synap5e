import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const GOOGLE_API_KEY = "YOUR_API_KEY"; // replace with your key

export default function SetLocation() {
  const [region, setRegion] = useState({
    latitude: 15.2993,
    longitude: 74.124,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [marker, setMarker] = useState({
    latitude: 15.2993,
    longitude: 74.124,
  });

  const [address, setAddress] = useState("");

  // 🔹 Function to reverse geocode (can later move to backend or Google API service)
  const fetchAddress = async (lat, lng) => {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      let data = await response.json();
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.log("Error fetching address:", error);
    }
  };

  // 🔹 Placeholder for saving address to backend
  const saveAddress = () => {
    console.log("Saving address:", address, marker);
    // Later: API call to backend -> save address
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1 px-4 pt-12"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text className="ml-3 text-lg font-semibold text-white">
          Set Your Location
        </Text>
      </View>

      {/* Steps */}
      <View className="flex-row justify-between items-center mb-6">
        {["Step 1", "Step 2", "Step 3", "Step 4"].map((step, index) => (
          <View key={index} className="items-center flex-1">
            <View
              className={`w-3 h-3 rounded-full ${
                index <= 1 ? "bg-cyan-400" : "bg-white/50"
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
        Where should the provider come?
      </Text>

      {/* Address Input */}
      <View className="bg-white rounded-xl flex-row items-center px-3 py-3 mb-4">
        <TextInput
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
          className="flex-1 text-gray-700"
        />
        <Ionicons name="location-sharp" size={20} color="black" />
      </View>

      {/* Live Map */}
      <View className="w-full h-60 rounded-xl overflow-hidden mb-4">
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
        >
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setMarker({ latitude, longitude });
              fetchAddress(latitude, longitude); // 🔹 update address
            }}
          />
        </MapView>
      </View>

      {/* Saved Address */}
      <TouchableOpacity
        className="bg-white rounded-xl px-4 py-3 flex-row items-center mb-4"
        onPress={() => router.push("/customerTabs/bookSteps/bookStep3")}
      >
        <View className="bg-black w-8 h-8 rounded-full items-center justify-center mr-3">
          <Ionicons name="home" size={18} color="white" />
        </View>
        <View>
          <Text className="font-semibold text-gray-800">Home</Text>
          <Text className="text-sm text-gray-500">
            {address || "Margao, Goa"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Add New Address */}
      <TouchableOpacity
        className="bg-white rounded-xl px-4 py-3 flex-row items-center justify-center"
        onPress={saveAddress}
      >
        <Ionicons name="add" size={20} color="black" />
        <Text className="ml-2 text-gray-700 font-medium">Add new address</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
