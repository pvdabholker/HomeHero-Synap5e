import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();

  // 🔹 State for user info (later fetched from backend)
  const [user, setUser] = useState({
    name: "John Doe",
    phone: "+1 234 567 8900",
    profilePic: require("../../assets/images/logo.png"),
  });

  // 🔹 Example useEffect to fetch user profile later
  useEffect(() => {
    // fetch("http://your-backend.com/api/user/profile")
    //   .then(res => res.json())
    //   .then(data => setUser(data))
    //   .catch(err => console.error(err));
  }, []);

  const menuItems = [
    {
      icon: <MaterialIcons name="history" size={26} color="#1d1664" />,
      title: "Booking History",
      route: "/customerTabs/bookings",
    },
    {
      icon: <Ionicons name="notifications-outline" size={26} color="#1d1664" />,
      title: "Notifications",
      route: "/customerTabs/notifications",
    },
    {
      icon: <MaterialIcons name="help-outline" size={26} color="#1d1664" />,
      title: "Help & Support",
      route: "/customerTabs/support",
    },
    {
      icon: <MaterialIcons name="settings" size={26} color="#1d1664" />,
      title: "Settings",
      route: "/customerTabs/settings",
    },
  ];

  const handleLogout = () => {
    // 🔹 Clear auth token/session here later
    // await AsyncStorage.removeItem("token");
    router.push("/auth/customer/customerLogin");
  };

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-6 pt-14 items-center">
          <Image
            source={user.profilePic}
            className="w-28 h-28 rounded-full border-4 border-white"
          />
          <Text className="text-white text-2xl font-bold mt-4">
            {user.name}
          </Text>
          <Text className="text-gray-200">{user.phone}</Text>

          <TouchableOpacity
            className="absolute top-16 right-6 bg-white/20 p-2 rounded-full"
            onPress={() => router.push("/customerTabs/EditProfile")}
          >
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-4 mt-10">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center bg-white rounded-xl shadow-md p-4 mb-4"
              onPress={() => router.push(item.route)}
            >
              <View className="w-12 h-12 bg-gray-100 rounded-lg items-center justify-center">
                {item.icon}
              </View>
              <Text className="ml-4 text-gray-800 text-lg flex-1">
                {item.title}
              </Text>
              <MaterialIcons name="chevron-right" size={26} color="#1d1664" />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row items-center bg-red-50 rounded-xl p-4 mt-6"
            onPress={handleLogout}
          >
            <View className="w-12 h-12 bg-red-100 rounded-lg items-center justify-center">
              <MaterialIcons name="logout" size={26} color="red" />
            </View>
            <Text className="ml-4 text-red-600 text-lg flex-1">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <Text className="text-center text-gray-300 py-6">Version 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}
