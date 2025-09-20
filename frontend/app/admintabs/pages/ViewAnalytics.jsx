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

const ViewAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState("overview");
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalProviders: 156,
      activeProviders: 89,
      totalBookings: 3421,
      completedBookings: 2987,
      averageRating: 4.6,
      customerRetention: 78.5,
    },
    revenue: {
      totalRevenue: 45680.5,
      monthlyGrowth: 12.5,
      averageBookingValue: 125.8,
      revenuePerProvider: 512.3,
    },
    userGrowth: {
      newUsersThisMonth: 156,
      newProvidersThisMonth: 23,
      growthRate: 8.7,
      churnRate: 2.1,
    },
    performance: {
      averageResponseTime: 2.3,
      bookingSuccessRate: 87.4,
      customerSatisfaction: 4.6,
      providerUtilization: 67.8,
    },
    topLocations: [
      { city: "New York", bookings: 456, revenue: 12450.0 },
      { city: "Los Angeles", bookings: 389, revenue: 10890.0 },
      { city: "Chicago", bookings: 234, revenue: 7650.0 },
      { city: "Houston", bookings: 198, revenue: 6780.0 },
      { city: "Phoenix", bookings: 167, revenue: 5430.0 },
    ],
    trending: {
      mostBookedService: "Plumbing",
      fastestGrowingService: "Home Security",
      peakBookingHour: "2:00 PM",
      busyDay: "Saturday",
    },
  });

  const metricOptions = [
    { value: "overview", label: "Overview", icon: "analytics-outline" },
    { value: "revenue", label: "Revenue", icon: "cash-outline" },
    { value: "users", label: "Users", icon: "people-outline" },
    { value: "performance", label: "Performance", icon: "speedometer-outline" },
    { value: "geography", label: "Geography", icon: "location-outline" },
    { value: "trends", label: "Trends", icon: "trending-up-outline" },
  ];

  useEffect(() => {
    // Load analytics data
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      // Here you would fetch analytics data from your backend
      // const data = await getAnalyticsData();
      // setAnalyticsData(data);
      console.log("Loading analytics data...");
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  const MetricCard = ({
    title,
    value,
    icon,
    trend,
    trendDirection,
    color = "#3B82F6",
  }) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trendDirection === "up" ? "trending-up" : "trending-down"}
            size={16}
            color={trendDirection === "up" ? "#10B981" : "#EF4444"}
          />
          <Text
            style={[
              styles.trendText,
              { color: trendDirection === "up" ? "#10B981" : "#EF4444" },
            ]}
          >
            {trend}
          </Text>
        </View>
      )}
    </View>
  );

  const LocationItem = ({ location, index }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationRank}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.city}</Text>
        <Text style={styles.locationSubtext}>{location.bookings} bookings</Text>
      </View>
      <View style={styles.locationRevenue}>
        <Text style={styles.revenueText}>
          ${location.revenue.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const TrendCard = ({ title, value, icon, description }) => (
    <View style={styles.trendCard}>
      <View style={styles.trendIcon}>
        <Ionicons name={icon} size={24} color="#3B82F6" />
      </View>
      <View style={styles.trendInfo}>
        <Text style={styles.trendTitle}>{title}</Text>
        <Text style={styles.trendValue}>{value}</Text>
        {description && (
          <Text style={styles.trendDescription}>{description}</Text>
        )}
      </View>
    </View>
  );

  const renderOverviewMetrics = () => (
    <View style={styles.metricsGrid}>
      <MetricCard
        title="Total Users"
        value={analyticsData.overview.totalUsers.toLocaleString()}
        icon="people-outline"
        color="#3B82F6"
      />
      <MetricCard
        title="Active Users"
        value={analyticsData.overview.activeUsers.toLocaleString()}
        icon="person-outline"
        color="#10B981"
      />
      <MetricCard
        title="Total Providers"
        value={analyticsData.overview.totalProviders.toLocaleString()}
        icon="construct-outline"
        color="#8B5CF6"
      />
      <MetricCard
        title="Active Providers"
        value={analyticsData.overview.activeProviders.toLocaleString()}
        icon="checkmark-circle-outline"
        color="#F59E0B"
      />
      <MetricCard
        title="Total Bookings"
        value={analyticsData.overview.totalBookings.toLocaleString()}
        icon="calendar-outline"
        color="#EF4444"
      />
      <MetricCard
        title="Completed Bookings"
        value={analyticsData.overview.completedBookings.toLocaleString()}
        icon="checkmark-done-outline"
        color="#10B981"
      />
      <MetricCard
        title="Average Rating"
        value={analyticsData.overview.averageRating.toString()}
        icon="star-outline"
        color="#F59E0B"
      />
      <MetricCard
        title="Customer Retention"
        value={`${analyticsData.overview.customerRetention}%`}
        icon="refresh-outline"
        color="#6B7280"
      />
    </View>
  );

  const renderRevenueMetrics = () => (
    <View style={styles.metricsGrid}>
      <MetricCard
        title="Total Revenue"
        value={`$${analyticsData.revenue.totalRevenue.toLocaleString()}`}
        icon="cash-outline"
        trend={`+${analyticsData.revenue.monthlyGrowth}%`}
        trendDirection="up"
        color="#10B981"
      />
      <MetricCard
        title="Average Booking Value"
        value={`$${analyticsData.revenue.averageBookingValue}`}
        icon="card-outline"
        color="#3B82F6"
      />
      <MetricCard
        title="Revenue per Provider"
        value={`$${analyticsData.revenue.revenuePerProvider}`}
        icon="person-circle-outline"
        color="#8B5CF6"
      />
      <MetricCard
        title="Monthly Growth"
        value={`${analyticsData.revenue.monthlyGrowth}%`}
        icon="trending-up-outline"
        trendDirection="up"
        color="#F59E0B"
      />
    </View>
  );

  const renderUserMetrics = () => (
    <View style={styles.metricsGrid}>
      <MetricCard
        title="New Users This Month"
        value={analyticsData.userGrowth.newUsersThisMonth.toLocaleString()}
        icon="person-add-outline"
        color="#10B981"
      />
      <MetricCard
        title="New Providers This Month"
        value={analyticsData.userGrowth.newProvidersThisMonth.toLocaleString()}
        icon="add-circle-outline"
        color="#3B82F6"
      />
      <MetricCard
        title="Growth Rate"
        value={`${analyticsData.userGrowth.growthRate}%`}
        icon="trending-up-outline"
        trend={`+${analyticsData.userGrowth.growthRate}%`}
        trendDirection="up"
        color="#F59E0B"
      />
      <MetricCard
        title="Churn Rate"
        value={`${analyticsData.userGrowth.churnRate}%`}
        icon="trending-down-outline"
        color="#EF4444"
      />
    </View>
  );

  const renderPerformanceMetrics = () => (
    <View style={styles.metricsGrid}>
      <MetricCard
        title="Avg Response Time"
        value={`${analyticsData.performance.averageResponseTime}h`}
        icon="time-outline"
        color="#3B82F6"
      />
      <MetricCard
        title="Booking Success Rate"
        value={`${analyticsData.performance.bookingSuccessRate}%`}
        icon="checkmark-circle-outline"
        color="#10B981"
      />
      <MetricCard
        title="Customer Satisfaction"
        value={analyticsData.performance.customerSatisfaction.toString()}
        icon="happy-outline"
        color="#F59E0B"
      />
      <MetricCard
        title="Provider Utilization"
        value={`${analyticsData.performance.providerUtilization}%`}
        icon="speedometer-outline"
        color="#8B5CF6"
      />
    </View>
  );

  const renderGeographyData = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Top Locations by Revenue</Text>
      <View style={styles.locationsList}>
        {analyticsData.topLocations.map((location, index) => (
          <LocationItem key={location.city} location={location} index={index} />
        ))}
      </View>
    </View>
  );

  const renderTrendsData = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Business Trends</Text>
      <View style={styles.trendsGrid}>
        <TrendCard
          title="Most Booked Service"
          value={analyticsData.trending.mostBookedService}
          icon="construct-outline"
          description="Leading service category"
        />
        <TrendCard
          title="Fastest Growing Service"
          value={analyticsData.trending.fastestGrowingService}
          icon="trending-up-outline"
          description="Highest growth rate"
        />
        <TrendCard
          title="Peak Booking Hour"
          value={analyticsData.trending.peakBookingHour}
          icon="time-outline"
          description="Most active time"
        />
        <TrendCard
          title="Busiest Day"
          value={analyticsData.trending.busyDay}
          icon="calendar-outline"
          description="Highest booking volume"
        />
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case "overview":
        return renderOverviewMetrics();
      case "revenue":
        return renderRevenueMetrics();
      case "users":
        return renderUserMetrics();
      case "performance":
        return renderPerformanceMetrics();
      case "geography":
        return renderGeographyData();
      case "trends":
        return renderTrendsData();
      default:
        return renderOverviewMetrics();
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>View Analytics</Text>
        <Text style={styles.subtitle}>Business intelligence and insights</Text>
      </View>

      <View style={styles.metricsSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {metricOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.metricBtn,
                selectedMetric === option.value && styles.metricBtnActive,
              ]}
              onPress={() => setSelectedMetric(option.value)}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={selectedMetric === option.value ? "white" : "#6B7280"}
              />
              <Text
                style={[
                  styles.metricBtnText,
                  selectedMetric === option.value && styles.metricBtnTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
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
  metricsSelector: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  metricBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
    gap: 6,
  },
  metricBtnActive: {
    backgroundColor: "#3B82F6",
  },
  metricBtnText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  metricBtnTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: "white",
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  locationsList: {
    gap: 12,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  locationSubtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  locationRevenue: {
    alignItems: "flex-end",
  },
  revenueText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
  trendsGrid: {
    gap: 12,
  },
  trendCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  trendIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EBF8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  trendDescription: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
});

export default ViewAnalytics;
