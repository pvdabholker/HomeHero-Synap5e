import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  Platform,
  ToastAndroid,
  DeviceEventEmitter,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../lib/api";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [upcomingList, setUpcomingList] = useState([]);
  const [backPressedOnce, setBackPressedOnce] = useState(false);

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

  // Listen for profile updates and booking updates
  useEffect(() => {
    loadMe();
    fetchUpcomingBookings(); // Initial fetch

    const sub1 = DeviceEventEmitter.addListener(
      "USER_AVATAR_UPDATED",
      ({ avatar_url }) => {
        setAvatarUrl(avatar_url || "");
      }
    );
    const sub2 = DeviceEventEmitter.addListener(
      "USER_PROFILE_UPDATED",
      ({ name }) => {
        if (name) setUserName(name);
      }
    );
    const sub3 = DeviceEventEmitter.addListener("BOOKING_CONFIRMED", () => {
      setTimeout(() => {
        fetchUpcomingBookings();
      }, 500);
    });

    return () => {
      sub1.remove();
      sub2.remove();
      sub3.remove();
    };
  }, [loadMe, fetchUpcomingBookings]);

  // Double-press back to exit on Android when on Home
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          if (backPressedOnce) {
            BackHandler.exitApp();
            return true;
          } else {
            setBackPressedOnce(true);
            ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
            setTimeout(() => setBackPressedOnce(false), 2000);
            return true;
          }
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [backPressedOnce])
  );

  const loadMe = useCallback(async () => {
    try {
      const me = await api.users.me();
      if (me) {
        setUserName(me.name || "");
        setUserLocation(me.location || me.pincode || "Goa");
        setAvatarUrl(me.avatar_url || "");
      }
    } catch (e) {
      setUserName("");
      setUserLocation("Goa");
      setAvatarUrl("");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const items = await api.services.getAll();
        setCategories(items || []);
      } catch (e) {
        setCategories([]);
      }
    })();
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  useFocusEffect(
    useCallback(() => {
      loadMe();
    }, [loadMe])
  );

  const fetchUpcomingBookings = useCallback(async () => {
    try {
      const list = await api.bookings.my();
      if (Array.isArray(list)) {
        const upcoming = list
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setUpcomingList(upcoming);
      } else {
        setUpcomingList([]);
      }
    } catch (e) {
      setUpcomingList([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUpcomingBookings();
    }, [fetchUpcomingBookings])
  );

  const handleSearch = async () => {
    try {
      const providers = await api.providers.search({
        service: search,
        limit: 10,
      });
      Alert.alert("Results", `Found ${providers?.length || 0} providers`);
    } catch (e) {
      Alert.alert("Search failed", e.message || "Please try again");
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-5 pt-14 flex-row items-center space-x-3">
        <Image
          source={avatarUrl ? { uri: avatarUrl } : undefined}
          className="w-12 h-12 rounded-full bg-gray-300"
        />
        <View>
          <Text className="text-white font-semibold mx-2">
            {`Hello${userName ? ", " : ""}${userName || "Guest"}`}
          </Text>
          <View className="flex-row items-center space-x-1 mx-2">
            <Ionicons name="location-sharp" size={14} color="white" />
            <Text className="text-white text-sm">{userLocation || "Goa"}</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-4">
        <View className="bg-white flex-row items-center px-3 py-2 rounded-lg">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search your services"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            className="flex-1 ml-2 text-gray-700"
          />
        </View>
      </View>

      {/* Categories and Upcoming Scroll content */}
      <ScrollView className="px-4 mt-6">
        {/* Categories */}
        <Text className="text-lg font-semibold text-white">Categories</Text>
        <View className="flex-row flex-wrap mt-4">
          {categories.map((item, index) => {
            const key = (item?.name || "").toLowerCase().replace(/[^a-z]/g, "");
            const icon = iconFor[key] || iconFor.default;
            return (
              <TouchableOpacity
                key={`${key}-${index}`}
                className="w-1/4 items-center mb-6"
                onPress={() =>
                  router.push(
                    `/customerTabs/bookSteps/bookStep1?category=${encodeURIComponent(
                      item?.name || ""
                    )}`
                  )
                }
              >
                <View className="w-16 h-16 rounded-lg bg-white shadow items-center justify-center">
                  {icon}
                </View>
                <Text className="mt-2 text-sm text-white">{item?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upcoming Bookings (scrollable horizontally) */}
        {upcomingList && upcomingList.length > 0 ? (
          <View className="mt-4 mb-8">
            <Text className="text-white text-xl font-semibold mb-3">
              Upcoming Bookings ({upcomingList.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {upcomingList.map((b) => (
                <View
                  key={`${b.booking_id}`}
                  className="bg-white/20 rounded-2xl p-4 mr-3 w-56"
                >
                  <View className="flex-row items-center mb-2">
                    <Image
                      source={{
                        uri:
                          b?.provider?.user?.avatar_url ||
                          "https://via.placeholder.com/50",
                      }}
                      className="w-10 h-10 rounded-lg mr-3 bg-white"
                    />
                    <View className="flex-1">
                      <Text
                        className="text-white font-semibold"
                        numberOfLines={1}
                      >
                        {b?.service_type || "Service"}
                      </Text>
                      <Text className="text-gray-200" numberOfLines={1}>
                        Status: {b?.status || "pending"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-200" numberOfLines={1}>
                    {formatDate(b?.date_time)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Nav */}
      <View className="flex-row justify-around py-3 bg-white border-t border-gray-200 pb-8">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/customerTabs/bookSteps/bookStep1")}
        >
          <Ionicons name="book" size={24} color="black" />
          <Text className="text-xs">Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/customerTabs/Profile")}
        >
          <Ionicons name="person" size={24} color="black" />
          <Text className="text-xs">Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
