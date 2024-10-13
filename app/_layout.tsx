import { Stack } from "expo-router";
import React from "react";
import Globalprovider from "../context/Globalprovider";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <Globalprovider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar translucent={true} barStyle={"dark-content"}/>
    </Globalprovider>
  );
}
