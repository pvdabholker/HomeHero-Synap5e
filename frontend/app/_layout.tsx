import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import './global.css';
import login from '@/components/open';

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='index'/>
    </Stack>
  );
}
