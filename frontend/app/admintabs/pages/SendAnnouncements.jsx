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

const SendAnnouncements = () => {
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
    target_audience: "all",
    priority: "normal",
    type: "general",
  });
  const [loading, setLoading] = useState(false);

  const audienceOptions = [
    { value: "all", label: "All Users", icon: "people-outline" },
    { value: "customers", label: "Customers Only", icon: "person-outline" },
    { value: "providers", label: "Providers Only", icon: "construct-outline" },
    { value: "admins", label: "Admins Only", icon: "shield-outline" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "#10B981" },
    { value: "normal", label: "Normal", color: "#3B82F6" },
    { value: "high", label: "High", color: "#F59E0B" },
    { value: "urgent", label: "Urgent", color: "#EF4444" },
  ];

  const typeOptions = [
    { value: "general", label: "General", icon: "information-circle-outline" },
    { value: "maintenance", label: "Maintenance", icon: "build-outline" },
    { value: "promotion", label: "Promotion", icon: "gift-outline" },
    { value: "update", label: "System Update", icon: "sync-outline" },
    { value: "emergency", label: "Emergency", icon: "alert-circle-outline" },
  ];

  const handleInputChange = (field, value) => {
    setAnnouncement((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!announcement.title.trim()) {
      Alert.alert("Validation Error", "Announcement title is required");
      return false;
    }

    if (!announcement.message.trim()) {
      Alert.alert("Validation Error", "Announcement message is required");
      return false;
    }

    if (announcement.title.length < 5) {
      Alert.alert(
        "Validation Error",
        "Title must be at least 5 characters long"
      );
      return false;
    }

    if (announcement.message.length < 10) {
      Alert.alert(
        "Validation Error",
        "Message must be at least 10 characters long"
      );
      return false;
    }

    return true;
  };

  const handleSendAnnouncement = async () => {
    if (!validateForm()) return;

    Alert.alert(
      "Confirm Send",
      `Are you sure you want to send this announcement to ${announcement.target_audience}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send",
          onPress: async () => {
            try {
              setLoading(true);

              // Here you would call your API to send the announcement
              // await sendAnnouncement(announcement);

              console.log("Announcement to be sent:", announcement);

              Alert.alert("Success", "Announcement sent successfully!", [
                {
                  text: "OK",
                  onPress: () => {
                    // Reset form
                    setAnnouncement({
                      title: "",
                      message: "",
                      target_audience: "all",
                      priority: "normal",
                      type: "general",
                    });
                  },
                },
              ]);
            } catch (error) {
              console.error("Error sending announcement:", error);
              Alert.alert(
                "Error",
                "Failed to send announcement. Please try again."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderAudienceSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Target Audience *</Text>
      <View style={styles.optionsGrid}>
        {audienceOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionCard,
              announcement.target_audience === option.value &&
                styles.optionCardActive,
            ]}
            onPress={() => handleInputChange("target_audience", option.value)}
          >
            <Ionicons
              name={option.icon}
              size={24}
              color={
                announcement.target_audience === option.value
                  ? "white"
                  : "#6B7280"
              }
            />
            <Text
              style={[
                styles.optionText,
                announcement.target_audience === option.value &&
                  styles.optionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Priority Level *</Text>
      <View style={styles.optionsRow}>
        {priorityOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.priorityBtn,
              { borderColor: option.color },
              announcement.priority === option.value && {
                backgroundColor: option.color,
              },
            ]}
            onPress={() => handleInputChange("priority", option.value)}
          >
            <Text
              style={[
                styles.priorityBtnText,
                {
                  color:
                    announcement.priority === option.value
                      ? "white"
                      : option.color,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTypeSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.label}>Announcement Type *</Text>
      <View style={styles.optionsRow}>
        {typeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.typeBtn,
              announcement.type === option.value && styles.typeBtnActive,
            ]}
            onPress={() => handleInputChange("type", option.value)}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={announcement.type === option.value ? "white" : "#6B7280"}
            />
            <Text
              style={[
                styles.typeBtnText,
                announcement.type === option.value && styles.typeBtnTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
        <Text style={styles.title}>Send Announcements</Text>
        <Text style={styles.subtitle}>Communicate with your users</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Announcement Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter announcement title..."
            value={announcement.title}
            onChangeText={(value) => handleInputChange("title", value)}
            maxLength={100}
          />
          <Text style={styles.charCount}>{announcement.title.length}/100</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your announcement message here..."
            multiline
            numberOfLines={6}
            value={announcement.message}
            onChangeText={(value) => handleInputChange("message", value)}
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {announcement.message.length}/500
          </Text>
        </View>

        {renderAudienceSelector()}
        {renderPrioritySelector()}
        {renderTypeSelector()}

        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitleText}>
                {announcement.title || "Announcement Title"}
              </Text>
              <View
                style={[
                  styles.previewPriority,
                  {
                    backgroundColor:
                      priorityOptions.find(
                        (p) => p.value === announcement.priority
                      )?.color || "#3B82F6",
                  },
                ]}
              >
                <Text style={styles.previewPriorityText}>
                  {announcement.priority.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.previewMessage}>
              {announcement.message ||
                "Your announcement message will appear here..."}
            </Text>
            <Text style={styles.previewAudience}>
              To:{" "}
              {
                audienceOptions.find(
                  (a) => a.value === announcement.target_audience
                )?.label
              }
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={handleSendAnnouncement}
          disabled={loading}
        >
          <Ionicons name="send-outline" size={20} color="white" />
          <Text style={styles.sendBtnText}>
            {loading ? "Sending..." : "Send Announcement"}
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
    height: 120,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  optionCardActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  optionTextActive: {
    color: "white",
  },
  priorityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "white",
  },
  priorityBtnText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 4,
  },
  typeBtnActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  typeBtnText: {
    fontSize: 12,
    color: "#6B7280",
  },
  typeBtnTextActive: {
    color: "white",
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  previewCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  previewTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    flex: 1,
  },
  previewPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewPriorityText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  previewMessage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  previewAudience: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  sendBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  sendBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  sendBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SendAnnouncements;
