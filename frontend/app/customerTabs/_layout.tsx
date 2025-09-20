import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { usePathname } from "expo-router";

export default function CustomerTabsLayout() {
  const pathname = usePathname();

  // Check if current path is any booking step
  const isInBookingFlow = pathname.includes("/bookSteps/");

  // Check if current path is any profile page
  const isInProfileFlow = pathname.includes("/profilePages/");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22d3ee", // cyan-400
        tabBarInactiveTintColor: "#6b7280", // gray-500
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookSteps/bookStep1"
        options={{
          title: "Book",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="event-note"
              size={22}
              color={isInBookingFlow ? "#22d3ee" : color}
            />
          ),
          tabBarLabelStyle: {
            color: isInBookingFlow ? "#22d3ee" : undefined,
          },
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notify",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline"
              size={22}
              color={isInProfileFlow ? "#22d3ee" : color}
            />
          ),
          tabBarLabelStyle: {
            color: isInProfileFlow ? "#22d3ee" : undefined,
          },
        }}
      />

      {/* Hide booking steps from tab bar */}

      <Tabs.Screen
        name="bookSteps/bookStep2"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
      <Tabs.Screen
        name="bookSteps/bookStep3"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
      <Tabs.Screen
        name="bookSteps/bookStep4"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />

      {/* Hide profile pages from tab bar */}
      <Tabs.Screen
        name="profilePages/BookingHistory"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
      <Tabs.Screen
        name="profilePages/EditProfile"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
      <Tabs.Screen
        name="profilePages/helpAndSupport"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
      <Tabs.Screen
        name="profilePages/settings"
        options={{
          href: null, // This removes it from the tab bar
        }}
      />
    </Tabs>
  );
}
