import { useGlobalContext } from "@/context/Globalprovider";
import { getCompetitions } from "@/lib/appwrite";
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

interface Competition {
  $id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl: string;
}

export default function CompetitionsScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [competition, setCompetition] = useState<Competition[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getCompetitions();
    const data: Competition[] = documents.map((doc: any) => ({
      $id: doc.$id,
      title: doc.title,
      description: doc.description,
      date: doc.date,
      time: doc.time,
      location: doc.location,
      imgUrl: doc.imgUrl,
    }));
    setCompetition(data);
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
          <Text className="text-xl font-bold">Competitions</Text>
        </View>

        <FlatList
          className="mt-8"
          data={competition}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/(competition)/view/${item.$id}`)}
            >
              <View className=" m-2">
                <View className="flex-row items-center">
                  <View className="flex flex-col w-1/3">
                    <Image
                      source={{ uri: item.imgUrl }}
                      className="w-24 h-24 rounded-md"
                    />
                  </View>
                  <View className="flex flex-col ml-2">
                    <Text className="text-lg w-2/3 font-bold">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500">
                      {new Date(item.date).toISOString().split("T")[0]} at{" "}
                      {item.time}
                    </Text>
                    <Text className="mt-1 text-gray-500">
                      Location: {item.location}
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
