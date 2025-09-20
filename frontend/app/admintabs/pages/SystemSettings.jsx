import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    app_name: "HomeHero",
    app_version: "1.0.0",
    maintenance_mode: false,
    registration_enabled: true,

    // Booking Settings
    default_booking_window: "7", // days
    max_advance_booking: "30", // days
    auto_accept_bookings: false,
    booking_cancellation_window: "24", // hours

    // Payment Settings
    service_fee_percentage: "5",
    payment_processing_fee: "2.9",
    minimum_booking_amount: "25",

    // Notification Settings
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,

    // Provider Settings
    auto_approve_providers: false,
    required_documents: ["id_card", "insurance", "license"],
    min_hourly_rate: "15",
    max_hourly_rate: "200",

    // System Limits
    max_file_upload_size: "10", // MB
    session_timeout: "24", // hours
    rate_limit_per_hour: "100",
  });

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from backend
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Here you would load settings from your backend
      // const settingsData = await getSystemSettings();
      // setSettings(settingsData);
      console.log("Loading system settings...");
    } catch (error) {
      console.error("Error loading settings:", error);
      Alert.alert("Error", "Failed to load system settings");
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);

      // Here you would save settings to your backend
      // await updateSystemSettings(settings);

      console.log("Settings to save:", settings);

      Alert.alert("Success", "System settings updated successfully!");
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default values?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            loadSettings(); // Reload original settings
            setHasChanges(false);
          },
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({ label, description, children }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description && (
          <Text style={styles.settingDescription}>{description}</Text>
        )}
      </View>
      <View style={styles.settingControl}>{children}</View>
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
        <Text style={styles.title}>System Settings</Text>
        <Text style={styles.subtitle}>Configure application settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title="General Settings">
          <SettingRow
            label="App Name"
            description="Display name of the application"
          >
            <TextInput
              style={styles.textInput}
              value={settings.app_name}
              onChangeText={(value) => handleSettingChange("app_name", value)}
            />
          </SettingRow>

          <SettingRow
            label="Maintenance Mode"
            description="Temporarily disable the app for maintenance"
          >
            <Switch
              value={settings.maintenance_mode}
              onValueChange={(value) =>
                handleSettingChange("maintenance_mode", value)
              }
            />
          </SettingRow>

          <SettingRow
            label="User Registration"
            description="Allow new user registrations"
          >
            <Switch
              value={settings.registration_enabled}
              onValueChange={(value) =>
                handleSettingChange("registration_enabled", value)
              }
            />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Booking Settings">
          <SettingRow
            label="Default Booking Window"
            description="Days in advance users can book (default)"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.default_booking_window}
              onChangeText={(value) =>
                handleSettingChange("default_booking_window", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Max Advance Booking"
            description="Maximum days in advance for bookings"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.max_advance_booking}
              onChangeText={(value) =>
                handleSettingChange("max_advance_booking", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Auto Accept Bookings"
            description="Automatically accept all new bookings"
          >
            <Switch
              value={settings.auto_accept_bookings}
              onValueChange={(value) =>
                handleSettingChange("auto_accept_bookings", value)
              }
            />
          </SettingRow>

          <SettingRow
            label="Cancellation Window"
            description="Hours before booking when cancellation is allowed"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.booking_cancellation_window}
              onChangeText={(value) =>
                handleSettingChange("booking_cancellation_window", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Payment Settings">
          <SettingRow
            label="Service Fee %"
            description="Platform commission percentage"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.service_fee_percentage}
              onChangeText={(value) =>
                handleSettingChange("service_fee_percentage", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Payment Processing Fee %"
            description="Payment gateway fee percentage"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.payment_processing_fee}
              onChangeText={(value) =>
                handleSettingChange("payment_processing_fee", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Minimum Booking Amount ($)"
            description="Minimum amount for a booking"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.minimum_booking_amount}
              onChangeText={(value) =>
                handleSettingChange("minimum_booking_amount", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Notification Settings">
          <SettingRow
            label="Email Notifications"
            description="Send notifications via email"
          >
            <Switch
              value={settings.email_notifications}
              onValueChange={(value) =>
                handleSettingChange("email_notifications", value)
              }
            />
          </SettingRow>

          <SettingRow
            label="Push Notifications"
            description="Send push notifications to mobile devices"
          >
            <Switch
              value={settings.push_notifications}
              onValueChange={(value) =>
                handleSettingChange("push_notifications", value)
              }
            />
          </SettingRow>

          <SettingRow
            label="SMS Notifications"
            description="Send notifications via SMS"
          >
            <Switch
              value={settings.sms_notifications}
              onValueChange={(value) =>
                handleSettingChange("sms_notifications", value)
              }
            />
          </SettingRow>
        </SettingSection>

        <SettingSection title="Provider Settings">
          <SettingRow
            label="Auto Approve Providers"
            description="Automatically approve new provider registrations"
          >
            <Switch
              value={settings.auto_approve_providers}
              onValueChange={(value) =>
                handleSettingChange("auto_approve_providers", value)
              }
            />
          </SettingRow>

          <SettingRow
            label="Minimum Hourly Rate ($)"
            description="Minimum allowed hourly rate for providers"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.min_hourly_rate}
              onChangeText={(value) =>
                handleSettingChange("min_hourly_rate", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Maximum Hourly Rate ($)"
            description="Maximum allowed hourly rate for providers"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.max_hourly_rate}
              onChangeText={(value) =>
                handleSettingChange("max_hourly_rate", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>
        </SettingSection>

        <SettingSection title="System Limits">
          <SettingRow
            label="Max File Upload Size (MB)"
            description="Maximum file size for uploads"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.max_file_upload_size}
              onChangeText={(value) =>
                handleSettingChange("max_file_upload_size", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Session Timeout (hours)"
            description="User session timeout duration"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.session_timeout}
              onChangeText={(value) =>
                handleSettingChange("session_timeout", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>

          <SettingRow
            label="Rate Limit (per hour)"
            description="API requests limit per user per hour"
          >
            <TextInput
              style={styles.numberInput}
              value={settings.rate_limit_per_hour}
              onChangeText={(value) =>
                handleSettingChange("rate_limit_per_hour", value)
              }
              keyboardType="numeric"
            />
          </SettingRow>
        </SettingSection>
      </ScrollView>

      {hasChanges && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetSettings}
          >
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSaveSettings}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "white",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  settingControl: {
    marginLeft: 16,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    minWidth: 120,
  },
  numberInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 80,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: "#6B7280",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  resetBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SystemSettings;
