import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const AddNewProvider = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    service_type: "",
    hourly_rate: "",
    description: "",
    experience_years: "",
    address: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);

  const serviceTypes = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Gardening",
    "Painting",
    "Carpentry",
    "HVAC",
    "Appliance Repair",
    "Home Security",
    "Moving Services",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "full_name",
      "email",
      "phone_number",
      "service_type",
      "hourly_rate",
    ];

    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert(
          "Validation Error",
          `${field.replace("_", " ")} is required`
        );
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    if (isNaN(formData.hourly_rate) || parseFloat(formData.hourly_rate) <= 0) {
      Alert.alert("Validation Error", "Please enter a valid hourly rate");
      return false;
    }

    if (
      formData.experience_years &&
      (isNaN(formData.experience_years) ||
        parseInt(formData.experience_years) < 0)
    ) {
      Alert.alert("Validation Error", "Please enter valid years of experience");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create the provider data
      const providerData = {
        ...formData,
        hourly_rate: parseFloat(formData.hourly_rate),
        experience_years: formData.experience_years
          ? parseInt(formData.experience_years)
          : 0,
        is_active: true,
        is_verified: true, // Admin-created providers are automatically verified
        status: "approved", // Admin-created providers are automatically approved
        documents_verified: true,
      };

      // Here you would call your API to create the provider
      // await createProvider(providerData);

      console.log("Provider data to be submitted:", providerData);

      Alert.alert("Success", "Provider has been added successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form
            setFormData({
              full_name: "",
              email: "",
              phone_number: "",
              service_type: "",
              hourly_rate: "",
              description: "",
              experience_years: "",
              address: "",
              availability: "",
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating provider:", error);
      Alert.alert("Error", "Failed to create provider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderServiceTypeSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Service Type *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.serviceTypeContainer}
      >
        {serviceTypes.map((service) => (
          <TouchableOpacity
            key={service}
            style={[
              styles.serviceTypeBtn,
              formData.service_type === service && styles.serviceTypeBtnActive,
            ]}
            onPress={() => handleInputChange("service_type", service)}
          >
            <Text
              style={[
                styles.serviceTypeBtnText,
                formData.service_type === service &&
                  styles.serviceTypeBtnTextActive,
              ]}
            >
              {service}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add New Provider</Text>
        <Text style={styles.subtitle}>
          Create a new service provider account
        </Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter provider's full name"
            value={formData.full_name}
            onChangeText={(value) => handleInputChange("full_name", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={formData.phone_number}
            onChangeText={(value) => handleInputChange("phone_number", value)}
          />
        </View>

        {renderServiceTypeSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Hourly Rate ($) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hourly rate"
            keyboardType="numeric"
            value={formData.hourly_rate}
            onChangeText={(value) => handleInputChange("hourly_rate", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            keyboardType="numeric"
            value={formData.experience_years}
            onChangeText={(value) =>
              handleInputChange("experience_years", value)
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter provider's address"
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={(value) => handleInputChange("address", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the services offered..."
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Availability</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter availability schedule (e.g., Mon-Fri 9AM-5PM)"
            multiline
            numberOfLines={3}
            value={formData.availability}
            onChangeText={(value) => handleInputChange("availability", value)}
          />
        </View>

        <View style={styles.noteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#3B82F6"
          />
          <Text style={styles.noteText}>
            Providers created by admin are automatically verified and approved.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? "Creating Provider..." : "Create Provider"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  serviceTypeContainer: {
    flexDirection: "row",
  },
  serviceTypeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  serviceTypeBtnActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  serviceTypeBtnText: {
    color: "#6B7280",
    fontSize: 14,
  },
  serviceTypeBtnTextActive: {
    color: "white",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noteText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#1E40AF",
    flex: 1,
  },
  submitBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddNewProvider;
