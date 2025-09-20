import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../../lib/api";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function UploadDocuments() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completeData, setCompleteData] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  // Load complete registration data
  useEffect(() => {
    const loadCompleteData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("tempCompleteData");
        if (storedData) {
          setCompleteData(JSON.parse(storedData));
        } else {
          Alert.alert(
            "Error",
            "Registration data not found. Please start the signup process again.",
            [
              {
                text: "OK",
                onPress: () =>
                  router.push("/auth/serviceProvider/serviceProviderSignUp"),
              },
            ]
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load registration data.");
      }
    };
    loadCompleteData();
  }, []);

  const handleBrowseFiles = () => {
    Alert.alert("Upload Documents", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Files", onPress: openDocumentPicker },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted === false) {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        addDocument(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera.");
    }
  };

  const openGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted === false) {
        Alert.alert(
          "Permission required",
          "Photo library permission is needed to select images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => addDocument(asset));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open gallery.");
    }
  };

  const openDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => addDocument(asset));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
    }
  };

  const addDocument = (asset) => {
    const newDoc = {
      id: Date.now() + Math.random(),
      name: asset.name || `Document_${Date.now()}`,
      uri: asset.uri,
      type: asset.mimeType || asset.type || "application/octet-stream",
      size: asset.size || 0,
    };
    setUploadedDocuments((prev) => [...prev, newDoc]);
  };

  const removeDocument = (id) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleContinue = async () => {
    if (!completeData) {
      Alert.alert(
        "Error",
        "Registration data not available. Please try again."
      );
      return;
    }

    if (uploadedDocuments.length === 0) {
      Alert.alert(
        "Documents Required",
        "Please upload at least one document to proceed with registration."
      );
      return;
    }

    setLoading(true);
    try {
      // Create the service provider account with all collected data
      const registrationPayload = {
        name: completeData.profileDetails.fullName,
        email: completeData.email,
        password: completeData.password,
        phone: completeData.profileDetails.contact,
        role: "service_provider",
      };

      // Register the user first
      const authResponse = await api.auth.register(registrationPayload);

      if (authResponse.success) {
        // Create provider profile with pending status
        const providerPayload = {
          ...completeData.profileDetails,
          user_id: authResponse.user.id,
          status: "pending", // Set status to pending for admin verification
          location: completeData.profileDetails.location,
          services: [completeData.profileDetails.serviceType],
          pricing: parseFloat(completeData.profileDetails.hourlyRate) || 0,
          experience_years:
            parseInt(completeData.profileDetails.experience) || 0,
          service_radius: 10,
        };

        const providerResponse = await api.providers.create(providerPayload);

        if (providerResponse.success) {
          // Clear temporary storage
          await AsyncStorage.multiRemove([
            "tempRegistrationData",
            "tempCompleteData",
          ]);

          Alert.alert(
            "Account Created Successfully!",
            "Your service provider account has been created and is pending admin verification. You will be notified once your account is approved. Please keep your documents ready for verification.",
            [
              {
                text: "Go to Login",
                onPress: () =>
                  router.push("/auth/serviceProvider/serviceProviderLogin"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Error",
            "Failed to create provider profile. Please try again."
          );
        }
      } else {
        Alert.alert(
          "Error",
          authResponse.message || "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View className="flex justify-center items-center mt-24">
          <Text className="text-2xl font-bold text-white">
            Upload Your Documents
          </Text>
        </View>

        {/* Upload Area */}
        <View className="mt-12 mx-8">
          <View className="bg-white rounded-2xl p-6 items-center justify-center">
            {/* Document Icon with Plus */}
            <View className="items-center mb-4">
              <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mb-2">
                <Ionicons name="document-text" size={24} color="#666666" />
              </View>
              <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full items-center justify-center">
                <Ionicons name="add" size={12} color="white" />
              </View>
            </View>

            {/* Upload Text */}
            <Text className="text-gray-600 text-base font-medium text-center mb-4">
              Drag files here or click to upload
            </Text>

            {/* Browse Files Button */}
            <TouchableOpacity
              onPress={handleBrowseFiles}
              className="bg-[#00EAFF] rounded-xl py-3 px-6"
            >
              <Text className="text-white text-base font-semibold">
                Browse Files
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Uploaded Documents List */}
        {uploadedDocuments.length > 0 && (
          <View className="mt-8 mx-8">
            <Text className="text-white text-lg font-semibold mb-4">
              Uploaded Documents ({uploadedDocuments.length})
            </Text>
            {uploadedDocuments.map((doc) => (
              <View
                key={doc.id}
                className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  {/* Document Icon or Image Preview */}
                  {doc.type.startsWith("image/") ? (
                    <Image
                      source={{ uri: doc.uri }}
                      className="w-12 h-12 rounded-lg mr-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-3">
                      <Ionicons name="document" size={24} color="#3B82F6" />
                    </View>
                  )}

                  {/* Document Info */}
                  <View className="flex-1">
                    <Text
                      className="text-gray-800 font-medium text-sm"
                      numberOfLines={1}
                    >
                      {doc.name}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {doc.size
                        ? `${(doc.size / 1024 / 1024).toFixed(2)} MB`
                        : "Unknown size"}
                    </Text>
                  </View>
                </View>

                {/* Remove Button */}
                <TouchableOpacity
                  onPress={() => removeDocument(doc.id)}
                  className="ml-2 p-2"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Continue Button */}
        <View className="mt-12 px-8 pb-8">
          <TouchableOpacity
            disabled={loading}
            className={`p-4 w-full rounded-xl ${loading ? "bg-gray-400" : "bg-[#00EAFF]"}`}
            onPress={handleContinue}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-medium text-lg">
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
