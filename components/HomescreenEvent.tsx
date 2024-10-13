import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface EventProps {
  event: {
    $id: string;
    title: string;
    type: string;
    description: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
    imgUrl?: string;
  };
}

const HomescreenEvent: React.FC<EventProps> = ({ event }) => {
  return (
    <TouchableOpacity
      className="flex flex-row bg-white p-4 m-1 rounded-lg shadow-lg shadow-blue-700"
      onPress={() => router.push(`/(event)/view/${event.$id}`)}
    >
      <View className="flex flex-col w-1/3">
        <Image
          source={{ uri: event.imgUrl }}
          className="rounded-lg h-36 p-1 mr-2 bg-blue-300"
          resizeMode="contain"
        />
      </View>

      <View className="flex flex-col w-2/3">
        <Text className="text-[16px] leading-6 text-gray-800">
          {event.title}
        </Text>

        <View className="flex flex-row justify-between items-center w-full mt-2">
          <View className="flex flex-row items-center gap-1">
            <FontAwesome name="calendar" size={15} color={"#006FFD"} />
            <Text className="text-[13px] text-gray-500">
              {new Date(event.date).toISOString().split("T")[0]}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-1">
            <FontAwesome name="clock-o" size={15} color={"#006FFD"} />
            <Text className="text-[13px] text-gray-500">{event.time}</Text>
          </View>
        </View>

        <View className="flex flex-row items-center gap-1 mb-2">
          <FontAwesome name="location-arrow" size={15} color={"#006FFD"} />
          <Text className="text-[13px] text-gray-500">{event.location}</Text>
        </View>

        <View className="flex flex-row items-center">
          <Text className="text-[12px] text-gray-600 text-justify">
            {event.description.length > 80
              ? `${event.description.substring(0, 80)}...`
              : event.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HomescreenEvent;
