import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const LeaderBoard = () => {
  const leaders = [
    { name: "Alice", score: 95 },
    { name: "Bob", score: 90 },
    { name: "Charlie", score: 85 },
    { name: "David", score: 80 },
    { name: "Eve", score: 75 },
    { name: "Frank", score: 70 },
    { name: "Grace", score: 65 },
    { name: "Hannah", score: 60 },
  ];

  return (
    <SafeAreaView>
      <View className="p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", top: 10, left: 10, }}
          className="p-1 bg-gray-200 rounded-full"
        >
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold mb-4 text-center mt-8">
          Southern Coast Clean Sweep
        </Text>
        <Text className="text-base font-semibold mb-4 text-left underline my-4">
          Leaderboard
        </Text>
        <View className="bg-white rounded-lg w-full shadow-md mt-8">
          <FlatList
            data={leaders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View className="flex-row py-3 px-4 border-b border-gray-200">
                <Text className="flex-1 text-sm text-gray-700">
                  {index + 1}
                </Text>
                <Text className="flex-1 text-sm text-gray-700">
                  {item.name}
                </Text>
                <Text className="flex-1 text-sm text-gray-700">
                  {item.score}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LeaderBoard;
