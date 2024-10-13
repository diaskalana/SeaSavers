import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HeaderTile = (props: React.PropsWithChildren<{ title: string }>) => {
  return (
    <View className="w-full p-0 m-0">
      <View className="p-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-primary" onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
          </Text>
          <Text className="text-black font-semibold text-xl">
            {props.title}
          </Text>
          <Text className="text-white"> </Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderTile;
