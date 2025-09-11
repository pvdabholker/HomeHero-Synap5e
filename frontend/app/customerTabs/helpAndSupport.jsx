import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HelpAndSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I book a service?",
      answer:
        "You can book a service by selecting a category from the home screen, choosing your preferred service provider, and following the booking steps.",
    },
    {
      id: 2,
      question: "How can I cancel my booking?",
      answer:
        "To cancel a booking, go to your bookings section, select the booking you want to cancel, and tap the cancel button. Cancellations are free if done 24 hours before the scheduled time.",
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including UPI, credit/debit cards, and cash on service completion.",
    },
    {
      id: 4,
      question: "How do I contact my service provider?",
      answer:
        "Once your booking is confirmed, you can chat with or call your service provider directly through the app.",
    },
  ];

  const supportOptions = [
    {
      title: "Chat Support",
      icon: "chatbubble-ellipses",
      onPress: () =>
        Alert.alert("Chat Support", "Our chat support will be available soon!"),
    },
    {
      title: "Call Support",
      icon: "call",
      onPress: () => Linking.openURL("tel:+911234567890"),
    },
    {
      title: "Email Support",
      icon: "mail",
      onPress: () => Linking.openURL("mailto:support@homehero.com"),
    },
  ];

  return (
    <LinearGradient
      colors={["#1d1664", "#c3c0d6"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1"
    >
      {/* Header */}
      <View className="px-5 pt-12 flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-semibold ml-3">
          Help & Support
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 34 }}
      >
        {/* Support Options */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              className="w-[31%] bg-white/20 rounded-xl p-4 items-center"
              onPress={option.onPress}
            >
              <Ionicons name={option.icon} size={28} color="#00EAFF" />
              <Text className="text-white text-xs mt-2">{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Support */}
        <TouchableOpacity
          className="bg-red-500/20 p-4 rounded-xl mb-6 flex-row items-center"
          onPress={() => Linking.openURL("tel:+911234567890")}
        >
          <MaterialIcons name="emergency" size={24} color="#ff4444" />
          <View className="ml-3 flex-1">
            <Text className="text-white font-semibold">Emergency Support</Text>
            <Text className="text-gray-200 text-sm">
              24/7 emergency assistance
            </Text>
          </View>
          <Ionicons name="call" size={24} color="#ff4444" />
        </TouchableOpacity>

        {/* FAQs */}
        <Text className="text-white text-lg font-semibold mb-3">
          Frequently Asked Questions
        </Text>
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            className="bg-white/20 rounded-xl mb-3 overflow-hidden"
            onPress={() =>
              setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
            }
          >
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-semibold flex-1 pr-4">
                  {faq.question}
                </Text>
                <Ionicons
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                />
              </View>
              {expandedFaq === faq.id && (
                <Text className="text-gray-200 mt-2">{faq.answer}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Additional Help */}
        <View className="mb-8 mt-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Additional Resources
          </Text>
          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold">Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/20 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold">Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-white/20 rounded-xl p-4">
            <Text className="text-white font-semibold">About Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
