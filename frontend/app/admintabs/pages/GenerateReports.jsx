import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const GenerateReports = () => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    {
      id: "financial",
      title: "Financial Report",
      description: "Revenue, fees, and financial analytics",
      icon: "cash-outline",
      color: "#10B981",
    },
    {
      id: "bookings",
      title: "Bookings Report",
      description: "Booking statistics and trends",
      icon: "calendar-outline",
      color: "#3B82F6",
    },
    {
      id: "providers",
      title: "Providers Report",
      description: "Provider performance and analytics",
      icon: "people-outline",
      color: "#8B5CF6",
    },
    {
      id: "customers",
      title: "Customers Report",
      description: "Customer behavior and statistics",
      icon: "person-outline",
      color: "#F59E0B",
    },
    {
      id: "services",
      title: "Services Report",
      description: "Service category performance",
      icon: "construct-outline",
      color: "#EF4444",
    },
    {
      id: "comprehensive",
      title: "Comprehensive Report",
      description: "Complete business overview",
      icon: "document-text-outline",
      color: "#6B7280",
    },
  ];

  const periodOptions = [
    { value: "last_7_days", label: "Last 7 Days" },
    { value: "last_30_days", label: "Last 30 Days" },
    { value: "last_90_days", label: "Last 90 Days" },
    { value: "last_6_months", label: "Last 6 Months" },
    { value: "last_year", label: "Last Year" },
    { value: "current_month", label: "Current Month" },
    { value: "current_year", label: "Current Year" },
    { value: "custom", label: "Custom Range" },
  ];

  const formatOptions = [
    { value: "pdf", label: "PDF", icon: "document-outline" },
    { value: "excel", label: "Excel", icon: "grid-outline" },
    { value: "csv", label: "CSV", icon: "list-outline" },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReportType) {
      Alert.alert("Error", "Please select a report type");
      return;
    }

    if (!selectedPeriod) {
      Alert.alert("Error", "Please select a time period");
      return;
    }

    try {
      setLoading(true);

      // Here you would call your API to generate the report
      const reportConfig = {
        type: selectedReportType,
        period: selectedPeriod,
        format: selectedFormat,
        timestamp: new Date().toISOString(),
      };

      console.log("Generating report with config:", reportConfig);

      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Report Generated",
        `Your ${reportTypes.find((r) => r.id === selectedReportType)?.title} has been generated successfully. You will receive a download link via email.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setSelectedReportType("");
              setSelectedPeriod("");
              setSelectedFormat("pdf");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error generating report:", error);
      Alert.alert("Error", "Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ReportTypeCard = ({ report }) => (
    <TouchableOpacity
      style={[
        styles.reportCard,
        selectedReportType === report.id && styles.reportCardSelected,
      ]}
      onPress={() => setSelectedReportType(report.id)}
    >
      <View style={[styles.reportIcon, { backgroundColor: report.color }]}>
        <Ionicons name={report.icon} size={24} color="white" />
      </View>
      <View style={styles.reportInfo}>
        <Text style={styles.reportTitle}>{report.title}</Text>
        <Text style={styles.reportDescription}>{report.description}</Text>
      </View>
      {selectedReportType === report.id && (
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      )}
    </TouchableOpacity>
  );

  const PeriodOption = ({ option }) => (
    <TouchableOpacity
      style={[
        styles.periodOption,
        selectedPeriod === option.value && styles.periodOptionSelected,
      ]}
      onPress={() => setSelectedPeriod(option.value)}
    >
      <Text
        style={[
          styles.periodText,
          selectedPeriod === option.value && styles.periodTextSelected,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const FormatOption = ({ option }) => (
    <TouchableOpacity
      style={[
        styles.formatOption,
        selectedFormat === option.value && styles.formatOptionSelected,
      ]}
      onPress={() => setSelectedFormat(option.value)}
    >
      <Ionicons
        name={option.icon}
        size={20}
        color={selectedFormat === option.value ? "white" : "#6B7280"}
      />
      <Text
        style={[
          styles.formatText,
          selectedFormat === option.value && styles.formatTextSelected,
        ]}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Generate Reports</Text>
        <Text style={styles.subtitle}>Create custom business reports</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Report Type</Text>
          <View style={styles.reportsList}>
            {reportTypes.map((report) => (
              <ReportTypeCard key={report.id} report={report} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodsGrid}>
            {periodOptions.map((option) => (
              <PeriodOption key={option.value} option={option} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export Format</Text>
          <View style={styles.formatsRow}>
            {formatOptions.map((option) => (
              <FormatOption key={option.value} option={option} />
            ))}
          </View>
        </View>

        {selectedReportType && selectedPeriod && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Report Summary</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Report Type:</Text>
                <Text style={styles.previewValue}>
                  {reportTypes.find((r) => r.id === selectedReportType)?.title}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Time Period:</Text>
                <Text style={styles.previewValue}>
                  {periodOptions.find((p) => p.value === selectedPeriod)?.label}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Format:</Text>
                <Text style={styles.previewValue}>
                  {formatOptions.find((f) => f.value === selectedFormat)?.label}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.generateBtn,
            (!selectedReportType || !selectedPeriod || loading) &&
              styles.generateBtnDisabled,
          ]}
          onPress={handleGenerateReport}
          disabled={!selectedReportType || !selectedPeriod || loading}
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text style={styles.generateBtnText}>
            {loading ? "Generating..." : "Generate Report"}
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  reportCardSelected: {
    borderColor: "#10B981",
    backgroundColor: "#ECFDF5",
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  reportDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  periodsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  periodOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
  periodOptionSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  periodText: {
    fontSize: 14,
    color: "#6B7280",
  },
  periodTextSelected: {
    color: "white",
  },
  formatsRow: {
    flexDirection: "row",
    gap: 12,
  },
  formatOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    gap: 8,
  },
  formatOptionSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  formatText: {
    fontSize: 14,
    color: "#6B7280",
  },
  formatTextSelected: {
    color: "white",
  },
  previewSection: {
    backgroundColor: "white",
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  previewCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  previewValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  footer: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  generateBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  generateBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  generateBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GenerateReports;
