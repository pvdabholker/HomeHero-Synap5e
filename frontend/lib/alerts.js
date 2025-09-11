import { Alert, ToastAndroid, Platform } from "react-native";

export const showAutoAlert = (title, message, duration = 4000) => {
  if (Platform.OS === "android") {
    // Use Toast on Android which auto-dismisses
    ToastAndroid.show(`${title}: ${message}`, ToastAndroid.LONG);
  } else {
    // Use Alert on iOS but with shorter message
    Alert.alert(title, message, [{ text: "OK", style: "default" }]);
  }
};

export const showErrorAlert = (message, duration = 4000) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(`Error: ${message}`, ToastAndroid.LONG);
  } else {
    Alert.alert("Error", message, [{ text: "OK" }]);
  }
};

export const showSuccessAlert = (message, duration = 3000) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(`Success: ${message}`, ToastAndroid.SHORT);
  } else {
    Alert.alert("Success", message, [{ text: "OK" }]);
  }
};
