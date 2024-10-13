import * as React from "react";
import { Text, View, Pressable } from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import { router } from "expo-router";

const BlogListItem = (blog: {
  $id: string;
  title: string;
  category: [string];
  content: string;
  imgUrl: string;
}) => {
  return (
    <View className="flex flex-row bg-white p-6 my-2 mx-4 rounded-lg shadow-lg items-center justify-between">
      <View className="flex flex-col w-2/3 pr-2">
        <Text className="text-[14px] font-semibold text-gray-800 ">
          {blog.title}
        </Text>
      </View>

      {/* <View className="flex flex-col w-1/3">
        <View className="flex flex-row justify-between items-center mb-2">
          <View className="grid grid-cols-2">
            <View className="flex flex-row items-center gap-2">
              <FontAwesome name="calendar" size={16} color={"#006FFD"} />
              <Text className="text-[14px] text-gray-600">
                {competition.date}
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
      </View> */}

      <View className="flex flex-col w-1/3 items-center ml-4">
        <Pressable
          onPress={() => {
            router.push(`/(blog)/update/${blog.$id}`);
          }}
          className="p-2 rounded-full bg-gray-100"
        >
          <Fontisto name="nav-icon-grid-a" size={20} color={"#006FFD"} />
        </Pressable>
      </View>
    </View>
  );
};

export default BlogListItem;
