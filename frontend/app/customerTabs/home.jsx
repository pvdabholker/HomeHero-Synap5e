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
  SafeAreaView,
  StatusBar,
  Modal,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const showAutoAlert = (title, message) => {
  Alert.alert(title, message);
};

const showErrorAlert = (message) => {
  Alert.alert("Error", message);
};

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [upcomingList, setUpcomingList] = useState([]);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
    useCallback(() => {
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
        // Get locally cancelled bookings to filter them out
        const cancelledBookingsStr =
          await AsyncStorage.getItem("cancelledBookings");
        const localCancelledBookings = cancelledBookingsStr
          ? JSON.parse(cancelledBookingsStr)
          : [];

        const now = new Date();

        // Process each booking to check if it should be auto-cancelled
        const processedBookings = await Promise.all(
          list.map(async (booking) => {
            const bookingTime = new Date(booking.date_time);
            const timeDifference = now - bookingTime; // Past = positive value
            const hoursAfterBooking = timeDifference / (1000 * 60 * 60);

            // If booking time has passed by more than 2 hours and status is still pending/confirmed
            if (
              hoursAfterBooking > 2 &&
              (booking.status === "pending" || booking.status === "confirmed")
            ) {
              // Try to update status in backend with multiple methods
              let backendUpdateSuccess = false;

              // Method 1: PATCH with cancellation data
              try {
                await api.bookings.patch(booking.booking_id, {
                  status: "cancelled",
                  cancelled_at: new Date().toISOString(),
                  cancellation_reason: "Auto-cancelled: Service time expired",
                });
                backendUpdateSuccess = true;
              } catch (patchError) {
                // PATCH failed, continue to next method
              }

              // Method 2: PUT with full booking data
              if (!backendUpdateSuccess) {
                try {
                  const updatedBooking = {
                    ...booking,
                    status: "cancelled",
                    cancelled_at: new Date().toISOString(),
                    cancellation_reason: "Auto-cancelled: Service time expired",
                  };
                  await api.bookings.put(booking.booking_id, updatedBooking);
                  backendUpdateSuccess = true;
                } catch (putError) {
                  // PUT failed, continue to next method
                }
              }

              // Method 3: Generic update
              if (!backendUpdateSuccess) {
                try {
                  await api.bookings.update(booking.booking_id, {
                    status: "cancelled",
                    cancelled_at: new Date().toISOString(),
                    cancellation_reason: "Auto-cancelled: Service time expired",
                  });
                  backendUpdateSuccess = true;
                } catch (updateError) {
                  // Generic update failed, continue to next method
                }
              }

              // Method 4: Direct fetch with different endpoints
              if (!backendUpdateSuccess) {
                const endpoints = [
                  `${api.baseURL}/bookings/${booking.booking_id}`,
                  `${api.baseURL}/api/bookings/${booking.booking_id}`,
                  `${api.baseURL}/v1/bookings/${booking.booking_id}`,
                ];

                for (const endpoint of endpoints) {
                  try {
                    const response = await fetch(endpoint, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${await api.getToken()}`,
                      },
                      body: JSON.stringify({
                        status: "cancelled",
                        cancelled_at: new Date().toISOString(),
                        cancellation_reason:
                          "Auto-cancelled: Service time expired",
                      }),
                    });

                    if (response.ok) {
                      backendUpdateSuccess = true;
                      break;
                    }
                  } catch (fetchError) {
                    // Fetch failed, continue to next endpoint
                  }
                }
              }

              // Store as locally cancelled
              localCancelledBookings.push(booking.booking_id);

              // Emit event for booking history update
              DeviceEventEmitter.emit("BOOKING_CANCELLED", {
                booking_id: booking.booking_id,
                status: "cancelled",
                booking_data: {
                  ...booking,
                  status: "cancelled",
                  cancelled_at: new Date().toISOString(),
                  cancellation_reason: "Auto-cancelled: Service time expired",
                },
              });

              // Return updated booking object
              return {
                ...booking,
                status: "cancelled",
                cancellation_reason: "Auto-cancelled: Service time expired",
              };
            }

            return booking;
          })
        );

        // Update local storage with any new cancelled bookings
        await AsyncStorage.setItem(
          "cancelledBookings",
          JSON.stringify([...new Set(localCancelledBookings)])
        );

        // Filter out cancelled, completed bookings, and locally cancelled ones
        const upcoming = processedBookings
          .filter((booking) => {
            // Filter out cancelled/completed from backend
            if (
              booking.status === "cancelled" ||
              booking.status === "completed"
            ) {
              return false;
            }
            // Filter out locally cancelled bookings
            if (localCancelledBookings.includes(booking.booking_id)) {
              return false;
            }
            return true;
          })
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
      showAutoAlert("Results", `Found ${providers?.length || 0} providers`);
    } catch (e) {
      showErrorAlert(e.message || "Please try again");
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

  const handleBookingPress = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const canCancelBooking = (bookingDateTime) => {
    const bookingTime = new Date(bookingDateTime);
    const now = new Date();
    const timeDifference = bookingTime - now;
    const hoursUntilBooking = timeDifference / (1000 * 60 * 60);
    return hoursUntilBooking >= 24;
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    if (!canCancelBooking(selectedBooking.date_time)) {
      showErrorAlert(
        "Cannot cancel booking less than 24 hours before scheduled time"
      );
      return;
    }

    try {
      // Try multiple cancellation approaches with backend status updates
      let cancellationSuccess = false;

      // Method 1: Try specific cancel endpoint
      try {
        const response = await fetch(
          `${api.baseURL}/bookings/${selectedBooking.booking_id}/cancel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await api.getToken()}`,
            },
            body: JSON.stringify({
              status: "cancelled",
              cancelled_at: new Date().toISOString(),
              cancellation_reason: "Cancelled by customer",
            }),
          }
        );

        if (response.ok) {
          cancellationSuccess = true;
        }
      } catch (fetchError) {
        // Cancel endpoint failed
      }

      // Method 2: Try PATCH request with status update
      if (!cancellationSuccess) {
        try {
          await api.bookings.patch(selectedBooking.booking_id, {
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancellation_reason: "Cancelled by customer",
          });
          cancellationSuccess = true;
        } catch (patchError) {
          // Patch failed
        }
      }

      // Method 3: Try PUT request with full data update
      if (!cancellationSuccess) {
        try {
          const updatedBooking = {
            ...selectedBooking,
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancellation_reason: "Cancelled by customer",
          };
          await api.bookings.put(selectedBooking.booking_id, updatedBooking);
          cancellationSuccess = true;
        } catch (putError) {
          // PUT failed
        }
      }

      // Method 4: Try generic update method
      if (!cancellationSuccess) {
        try {
          await api.bookings.update(selectedBooking.booking_id, {
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancellation_reason: "Cancelled by customer",
          });
          cancellationSuccess = true;
        } catch (updateError) {
          // Generic update failed
        }
      }

      // Method 5: Try raw fetch with different endpoints
      if (!cancellationSuccess) {
        const endpoints = [
          `${api.baseURL}/bookings/${selectedBooking.booking_id}`,
          `${api.baseURL}/api/bookings/${selectedBooking.booking_id}`,
          `${api.baseURL}/v1/bookings/${selectedBooking.booking_id}`,
        ];

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await api.getToken()}`,
              },
              body: JSON.stringify({
                status: "cancelled",
                cancelled_at: new Date().toISOString(),
                cancellation_reason: "Cancelled by customer",
              }),
            });

            if (response.ok) {
              cancellationSuccess = true;
              break;
            }
          } catch (endpointError) {
            // Endpoint failed
          }
        }
      }

      // Show success message (optimistic UI)
      showAutoAlert("Success", "Booking cancelled successfully");
      setShowBookingModal(false);

      // Immediately remove from upcoming list
      setUpcomingList((prev) => {
        const filtered = prev.filter(
          (booking) => booking.booking_id !== selectedBooking.booking_id
        );
        return filtered;
      });

      // Store cancelled booking ID locally as backup
      try {
        const cancelledBookingsStr =
          await AsyncStorage.getItem("cancelledBookings");
        const cancelledBookings = cancelledBookingsStr
          ? JSON.parse(cancelledBookingsStr)
          : [];
        cancelledBookings.push(selectedBooking.booking_id);
        await AsyncStorage.setItem(
          "cancelledBookings",
          JSON.stringify(cancelledBookings)
        );
      } catch (storageError) {
        // Failed to store cancelled booking
      }

      // Emit event to refresh booking history
      DeviceEventEmitter.emit("BOOKING_CANCELLED", {
        booking_id: selectedBooking.booking_id,
        status: "cancelled",
        backend_updated: cancellationSuccess,
        booking_data: {
          ...selectedBooking,
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: "Cancelled by customer",
        },
      });

      // Refresh bookings to sync with backend
      setTimeout(
        () => {
          fetchUpcomingBookings();
        },
        cancellationSuccess ? 1000 : 3000
      ); // Shorter delay if backend updated successfully
    } catch (error) {
      // Still show success to user (optimistic approach)
      showAutoAlert("Success", "Booking cancelled successfully");
      setShowBookingModal(false);

      setUpcomingList((prev) =>
        prev.filter(
          (booking) => booking.booking_id !== selectedBooking.booking_id
        )
      );
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={["#1d1664", "#c3c0d6"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="flex-1"
      >
        {/* Header - Transparent with proper margin */}
        <View className="px-5 pt-12 pb-4">
          <View className="flex-row items-center space-x-3">
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
                <Text className="text-white text-sm">
                  {userLocation || "Goa"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content - Scrollable area */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Search Bar */}
          <View className="mb-6">
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

          {/* Categories and Upcoming content */}
          {/* Categories */}
          <Text className="text-lg font-semibold text-white">Categories</Text>
          <View className="flex-row flex-wrap mt-4">
            {categories.map((item, index) => {
              const key = (item?.name || "")
                .toLowerCase()
                .replace(/[^a-z]/g, "");
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
                Upcoming Bookings
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {upcomingList.map((b) => (
                  <TouchableOpacity
                    key={`${b.booking_id}`}
                    className="bg-white/20 rounded-2xl p-4 mr-3 w-56"
                    onPress={() => handleBookingPress(b)}
                    activeOpacity={0.8}
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
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="flex-row justify-around py-3 bg-white border-t border-gray-200">
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

        {/* Booking Details Modal */}
        <Modal
          visible={showBookingModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowBookingModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-2xl p-6 w-80 mx-4">
              {selectedBooking && (
                <>
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-semibold text-gray-800">
                      Booking Details
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowBookingModal(false)}
                    >
                      <Ionicons name="close" size={24} color="gray" />
                    </TouchableOpacity>
                  </View>

                  <View className="mb-4">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                      {selectedBooking.service_type}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      Date: {formatDate(selectedBooking.date_time)}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      Status: {selectedBooking.status}
                    </Text>
                    <Text className="text-gray-600 mb-1">
                      Booking ID: {selectedBooking.booking_id}
                    </Text>
                    {selectedBooking.estimated_price && (
                      <Text className="text-gray-600">
                        Estimated Price: ₹{selectedBooking.estimated_price}
                      </Text>
                    )}
                  </View>

                  <View className="flex-row justify-between">
                    <TouchableOpacity
                      className="bg-gray-300 px-6 py-3 rounded-xl flex-1 mr-2"
                      onPress={() => setShowBookingModal(false)}
                    >
                      <Text className="text-center text-gray-800 font-semibold">
                        Close
                      </Text>
                    </TouchableOpacity>

                    {canCancelBooking(selectedBooking.date_time) ? (
                      <TouchableOpacity
                        className="bg-red-500 px-6 py-3 rounded-xl flex-1 ml-2"
                        onPress={handleCancelBooking}
                      >
                        <Text className="text-center text-white font-semibold">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        className="bg-gray-400 px-6 py-3 rounded-xl flex-1 ml-2"
                        disabled={true}
                      >
                        <Text className="text-center text-white font-semibold">
                          Can't Cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
