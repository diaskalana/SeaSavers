import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/Globalprovider";
import { getEventById } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

interface Event {
  $id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  imgUrl?: string;
}

export default function EventDetailsScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);
    const documents = await getEventById(id as string);
    const data: Event[] = documents.map((doc: any) => ({
      $id: doc.$id,
      title: doc.title,
      type: doc.type,
      description: doc.description,
      date: doc.date,
      time: doc.time,
      location: doc.location,
      organizer: doc.organizer,
      imgUrl: doc.imgUrl,
    }));
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {events.length == 0 && (
          <View className="flex justify-center items-center">
            <Loader isLoading={isLoading} />
          </View>
        )}
        {events.length > 0 && (
          <>
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: events[0].imgUrl }}
                resizeMode="cover"
                style={{
                  marginTop: 0,
                  width: "100%",
                  height: 248,
                  backgroundColor: "#D1D5DB",
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}              
                className="absolute top-3 left-3 p-1 bg-gray-200 rounded-full "
              >
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
              <Text
                className="absolute top-48 text-left text-base font-bold p-4 w-full text-gray-900"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.88)" }}
              >
                {events[0].title}
              </Text>
            </View>

            <View className="flex flex-col justify-between p-4 w-full gap-2">
              <View className="flex flex-row">
                <View className="flex flex-col w-1/2 ">
                  <View className="flex flex-row items-center align-middle gap-2">
                    <View className="px-4 py-[2px] bg-primary rounded-full">
                      <Text className="text-[14px] text-white ">Date: </Text>
                    </View>
                    <Text className="text-[14px] text-gray-600">
                      {new Date(events[0].date).toISOString().split("T")[0]}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-col w-1/2">
                  <View className="flex flex-row items-center gap-2">
                    <View className="px-4 py-[2px] bg-primary rounded-full">
                      <Text className="text-[14px] text-white ">Time: </Text>
                    </View>
                    <Text className="text-[14px] text-gray-600">
                      {events[0].time}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex flex-row pl-1">
                <View className="flex flex-col w-1/2 ">
                  <View className="flex flex-row items-center align-middle gap-2">
                    <FontAwesome
                      name="location-arrow"
                      size={16}
                      color={"#006FFD"}
                    />
                    <Text className="text-[14px] text-gray-600">
                      {events[0].location}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-col w-1/2">
                  <View className="flex flex-row items-center gap-2">
                    <FontAwesome name="users" size={16} color={"#006FFD"} />
                    <Text className="text-[14px] text-gray-600">
                      {events[0].organizer}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="p-4">
              <Text className="font-normal text-[16px] text-justify leading-6 text-gray-700">
                {events[0].description}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
