import * as React from "react";
import { Text, View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";

const CompetitionListItem = (competition: {
  $id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl?: string;
}) => {
  return (
    <View className="flex flex-row bg-white p-6 my-2 mx-4 rounded-lg shadow-lg">
      <View className="flex flex-col w-1/2 text-justify pr-2">
        <Text className="text-[18px] font-semibold leading-6 text-gray-800">
          {competition.title}
        </Text>
      </View>

      <View className="flex flex-col w-1/3">
        <View className="flex flex-row justify-between items-center mb-2">
          <View className="grid grid-cols-2">
            <View className="flex flex-row items-center gap-2">
              <FontAwesome name="calendar" size={16} color={"#006FFD"} />
              <Text className="text-[14px] text-gray-600">
                {competition.date.split("T")[0]}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <FontAwesome name="clock-o" size={16} color={"#006FFD"} />
              <Text className="text-[14px] text-gray-600">
                {competition.time}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex flex-row items-center ml-4">
        <Pressable
          onPress={() => {
            router.push(`/(competition)/update/${competition.$id}`);
          }}
          className="p-2 rounded-full bg-gray-100"
        >
          <Fontisto name="nav-icon-grid-a" size={20} color={"#006FFD"} />
        </Pressable>
      </View>
    </View>
  );
};

export default CompetitionListItem;
