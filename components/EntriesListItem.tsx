import * as React from "react";
import { Text, View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";

interface EntiesProps {
  entry: {
    $id: string;
    user: {
        username: string;
    };
    competition: {
        title: string;
    };
    totItems: number;
    totPoints: number;
    note: string;
  };
}

const Event: React.FC<EntiesProps> = ({ entry }) => {
  return (
    <View className="flex flex-row bg-white p-4 my-2 mx-4 justify-between rounded-lg shadow-lg">
      <View className="flex flex-col w-2/3 pr-2">
        <Text className="text-lg font-bold text-gray-900">
          {entry.competition.title}
        </Text>
        <Text className="text-sm text-gray-600">
          @{entry.user.username}
        </Text>
      </View>

      <View className="flex flex-col w-1/3 items-center justify-center ml-4">
        <Pressable onPress={() => {
          router.push(`/(compentry)/update/${entry.$id}`);
        }} className="p-2 rounded-full bg-blue-100">
          <Fontisto name="nav-icon-grid-a" size={20} color={"#006FFD"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Event;
