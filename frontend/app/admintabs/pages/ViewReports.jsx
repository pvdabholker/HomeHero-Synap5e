import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ViewReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [reportData, setReportData] = useState({
    overview: {
      totalRevenue: 15420.5,
      totalBookings: 128,
      activeProviders: 45,
      newCustomers: 23,
    },
    bookingsData: {
      completed: 98,
      pending: 15,
      cancelled: 15,
      totalValue: 12340.0,
    },
    revenueData: {
      serviceFees: 2850.75,
      processingFees: 447.19,
      netRevenue: 12122.56,
    },
    topServices: [
      { name: "Plumbing", bookings: 32, revenue: 4800.0 },
      { name: "Cleaning", bookings: 28, revenue: 2800.0 },
      { name: "Electrical", bookings: 25, revenue: 4250.0 },
      { name: "Gardening", bookings: 18, revenue: 1890.0 },
      { name: "Painting", bookings: 15, revenue: 2100.0 },
    ],
    topProviders: [
      { name: "John Smith", bookings: 12, rating: 4.9, revenue: 1890.0 },
      { name: "Sarah Wilson", bookings: 10, rating: 4.8, revenue: 1560.0 },
      { name: "Mike Johnson", bookings: 9, rating: 4.7, revenue: 1350.0 },
      { name: "Lisa Brown", bookings: 8, rating: 4.9, revenue: 1120.0 },
      { name: "David Lee", bookings: 7, rating: 4.6, revenue: 980.0 },
    ],
  });

  const periodOptions = [
    { value: "7days", label: "7 Days" },
    { value: "30days", label: "30 Days" },
    { value: "90days", label: "90 Days" },
    { value: "1year", label: "1 Year" },
  ];

  useEffect(() => {
    // Load report data based on selected period
    loadReportData(selectedPeriod);
  }, [selectedPeriod]);

  const loadReportData = async (period) => {
    try {
      // Here you would fetch report data from your backend
      // const data = await getReportsData(period);
      // setReportData(data);
      console.log(`Loading report data for period: ${period}`);
    } catch (error) {
      console.error("Error loading report data:", error);
    }
  };

  const MetricCard = ({ title, value, icon, color = "#3B82F6", subtitle }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="white" />
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ReportSection = ({ title, children }) => (
    <View style={styles.reportSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const TopServiceItem = ({ service, index }) => (
    <View style={styles.topItem}>
      <View style={styles.topItemRank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.topItemInfo}>
        <Text style={styles.topItemName}>{service.name}</Text>
        <Text style={styles.topItemSubtext}>{service.bookings} bookings</Text>
      </View>
      <View style={styles.topItemValue}>
        <Text style={styles.topItemRevenue}>${service.revenue.toFixed(2)}</Text>
      </View>
    </View>
  );

  const TopProviderItem = ({ provider, index }) => (
    <View style={styles.topItem}>
      <View style={styles.topItemRank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.topItemInfo}>
        <Text style={styles.topItemName}>{provider.name}</Text>
        <View style={styles.providerStats}>
          <Text style={styles.topItemSubtext}>
            {provider.bookings} bookings
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.ratingText}>{provider.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.topItemValue}>
        <Text style={styles.topItemRevenue}>
          ${provider.revenue.toFixed(2)}
        </Text>
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
        <Text style={styles.title}>View Reports</Text>
        <Text style={styles.subtitle}>Business analytics and insights</Text>
      </View>

      <View style={styles.periodSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.periodBtn,
                selectedPeriod === option.value && styles.periodBtnActive,
              ]}
              onPress={() => setSelectedPeriod(option.value)}
            >
              <Text
                style={[
                  styles.periodBtnText,
                  selectedPeriod === option.value && styles.periodBtnTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ReportSection title="Overview">
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Revenue"
              value={`$${reportData.overview.totalRevenue.toLocaleString()}`}
              icon="cash-outline"
              color="#10B981"
            />
            <MetricCard
              title="Total Bookings"
              value={reportData.overview.totalBookings.toString()}
              icon="calendar-outline"
              color="#3B82F6"
            />
            <MetricCard
              title="Active Providers"
              value={reportData.overview.activeProviders.toString()}
              icon="people-outline"
              color="#8B5CF6"
            />
            <MetricCard
              title="New Customers"
              value={reportData.overview.newCustomers.toString()}
              icon="person-add-outline"
              color="#F59E0B"
            />
          </View>
        </ReportSection>

        <ReportSection title="Booking Statistics">
          <View style={styles.bookingStats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Completed Bookings</Text>
              <Text style={[styles.statValue, { color: "#10B981" }]}>
                {reportData.bookingsData.completed}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Pending Bookings</Text>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>
                {reportData.bookingsData.pending}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Cancelled Bookings</Text>
              <Text style={[styles.statValue, { color: "#EF4444" }]}>
                {reportData.bookingsData.cancelled}
              </Text>
            </View>
            <View style={[styles.statRow, styles.totalRow]}>
              <Text style={styles.statLabel}>Total Booking Value</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: "#111827", fontWeight: "bold" },
                ]}
              >
                ${reportData.bookingsData.totalValue.toLocaleString()}
              </Text>
            </View>
          </View>
        </ReportSection>

        <ReportSection title="Revenue Breakdown">
          <View style={styles.revenueBreakdown}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Service Fees</Text>
              <Text style={styles.statValue}>
                ${reportData.revenueData.serviceFees.toLocaleString()}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Processing Fees</Text>
              <Text style={styles.statValue}>
                ${reportData.revenueData.processingFees.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statRow, styles.totalRow]}>
              <Text style={styles.statLabel}>Net Revenue</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: "#10B981", fontWeight: "bold" },
                ]}
              >
                ${reportData.revenueData.netRevenue.toLocaleString()}
              </Text>
            </View>
          </View>
        </ReportSection>

        <ReportSection title="Top Services">
          <View style={styles.topList}>
            {reportData.topServices.map((service, index) => (
              <TopServiceItem
                key={service.name}
                service={service}
                index={index}
              />
            ))}
          </View>
        </ReportSection>

        <ReportSection title="Top Providers">
          <View style={styles.topList}>
            {reportData.topProviders.map((provider, index) => (
              <TopProviderItem
                key={provider.name}
                provider={provider}
                index={index}
              />
            ))}
          </View>
        </ReportSection>
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
  periodSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  periodBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  periodBtnActive: {
    backgroundColor: "#3B82F6",
  },
  periodBtnText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  periodBtnTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  reportSection: {
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
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  metricCard: {
    width: (width - 48) / 2,
    backgroundColor: "#F9FAFB",
    margin: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  metricSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  bookingStats: {
    padding: 16,
  },
  revenueBreakdown: {
    padding: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    marginTop: 8,
    paddingTop: 16,
  },
  statLabel: {
    fontSize: 16,
    color: "#374151",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  topList: {
    padding: 16,
  },
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  topItemRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  topItemInfo: {
    flex: 1,
  },
  topItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  topItemSubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  providerStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  ratingText: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 2,
    fontWeight: "600",
  },
  topItemValue: {
    alignItems: "flex-end",
  },
  topItemRevenue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
});

export default ViewReports;
