import * as React from "react";
import { Text, View, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";

interface RequestProps {
  request: {
    $id: string;
    fullName: string;
    email: string;
    phone: string;
    description: string;
    organizer: string;
  };
}

const Event: React.FC<RequestProps> = ({ request }) => {
  return (
    <View className="flex flex-row bg-white p-6 my-2 mx-4 rounded-lg shadow-lg  justify-between">
      <View className="flex flex-col text-justify pr-2 max-w-[240px]">
        <Text className="text-[18px] font-semibold leading-6 text-gray-800">
          {request.fullName}
        </Text>
        <Text className="text-[14px] text-gray-600">{request.email}</Text>
        <Text className="text-[14px] text-gray-600">{request.phone}</Text>
        <Text className="text-[14px] text-gray-600 mt-1">
          {request.description.length > 100 ? request.description.substring(0, 100) + "..." : request.description}
        </Text>
      </View>


      <View className="flex flex-row items-center ml-4">
        <Pressable onPress={() => {
          router.push(`/(request)/view/${request.$id}`);
        }} className="p-2 rounded-full bg-gray-100">
          <Fontisto name="nav-icon-grid-a" size={20} color={"#006FFD"} />
        </Pressable>
      </View>
    </View>
  );
};

export default Event;
