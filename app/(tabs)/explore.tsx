import { useGlobalContext } from "@/context/Globalprovider";
import { getBlogs, getCompetitions } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Blog {
  $id: string;
  title: string;
  content: string;
  imgUrl: string;
  category: [string];
}

export default function ExploreScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }
  const [blog, setBlog] = useState<Blog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getBlogs();
    const data: Blog[] = documents.map((doc: any) => ({
      $id: doc.$id,
      title: doc.title,
      content: doc.content,
      imgUrl: doc.imgUrl,
      category: doc.category,
    }));

    setBlog(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const refetch = async () => getData();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="p-2">
        <View className="flex-row justify-center items-center">
          <Text className="text-xl font-bold">Blogs</Text>
        </View>

        <FlatList
          className="mt-8"
          data={blog}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(blog)/view/${item.$id}`)}
            >
              <View className=" m-2">
                <View className="flex-row items-center">
                  <View className="flex flex-col w-1/3">
                    <Image
                      source={{ uri: item.imgUrl }}
                      className="w-24 h-24 rounded-md"
                    />
                  </View>
                  <View className="flex flex-col ml-2 w-2/3 px-2">
                    <Text className="text-lg  font-bold">
                    {item.title.substring(0, 20)}...
                    </Text>
                    <Text className="mt-1 text-gray-500">
                      Category: {item.category.join(", ")}
                    </Text>
                    
                    <Text className="mt-1 text-gray-500 text-justify">
                      {item.content.substring(0, 70)}...
                    </Text>
                  </View>
                </View>
                <View className="border border-gray-200 mt-4"></View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
