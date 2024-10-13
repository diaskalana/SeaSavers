import * as React from "react";
import { Text, View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";

interface EventProps {
  event: {
    $id: string;
    id: number;
    title: string;
    type: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
  };
}

const Event: React.FC<EventProps> = ({ event }) => {
  return (
    <View className="flex flex-row bg-white p-6 my-2 mx-4 rounded-lg shadow-lg">
      <View className="flex flex-col w-1/2 text-justify pr-2">
        <Text className="text-[18px] font-semibold leading-6 text-gray-800">
          {event.title}
        </Text>
      </View>

      <View className="flex flex-col w-1/3">
        <View className="flex flex-row justify-between items-center mb-2">
          <View className="grid grid-cols-2">
            <View className="flex flex-row items-center justify-center  gap-2">
              <FontAwesome name="calendar" size={16} color={"#006FFD"} />
              <Text className="text-[14px] text-gray-600">
                {new Date(event.date).toISOString().split("T")[0]}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <FontAwesome name="clock-o" size={16} color={"#006FFD"} />
              <Text className="text-[14px] text-gray-600">{event.time}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex flex-row items-center ml-4">
        <Pressable onPress={() => {
          router.push(`/(event)/update/${event.$id}`);
        }} className="p-2 rounded-full bg-gray-100">
          <Fontisto name="nav-icon-grid-a" size={20} color={"#006FFD"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Event;
