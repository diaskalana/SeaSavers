import HomescreenEvent from "@/components/HomescreenEvent";
import ImageGallery from "@/components/ImageGallery";
import { useGlobalContext } from "@/context/Globalprovider";
import { getEvents } from "@/lib/appwrite";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DATA = [
  {
    id: "1",
    title: "First Item",
    imageUrl:
      "https://20811975.fs1.hubspotusercontent-na1.net/hubfs/20811975/Imported_Blog_Media/Screen-Shot-2020-07-10-at-3_01_36-PM-3511-1594418610-2.png",
  },
  {
    id: "2",
    title: "Second Item",
    imageUrl:
      "https://cdn.vectorstock.com/i/500p/60/81/beach-clean-up-concept-vector-49556081.jpg",
  },
  {
    id: "3",
    title: "Third Item",
    imageUrl:
      "https://images.encounteredu.com/excited-hare/production/uploads/Top-ten-items-international-coastal-cleanup-2020.jpg?w=1200&h=800&q=80&auto=format&fit=clip&dm=1631569439&s=6d6e955b2b8c14a97a33bfa8558bab86",
  },
  {
    id: "4",
    title: "Fourth Item",
    imageUrl:
      "https://www.wastemanaged.co.uk/wp-content/uploads/2024/03/Beach-Litter.webp",
  },
];

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

export default function HomeScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getEvents();
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
    <SafeAreaView className="w-full h-full p-3 bg-white">
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={[1]} // Dummy data to create a single item for header
        renderItem={() => (
          <View>
            <View className="bg-white h-fit rounded-md m-1 p-2 shadow-lg shadow-blue-700">
              <Text className="text-[24px] ">👋 Welcome Back,</Text>
              {user && (
                <Text className="ml-2 text-lg">✨ @{user.username} ✨</Text>
              )}
            </View>

            {/* Horizontal FlatList */}
            <FlatList
              className="bg-white rounded-md my-3 mx-1 p-2 shadow-lg shadow-blue-700"
              data={DATA}
              renderItem={({ item }) => (
                <ImageGallery title={item.title} imageUrl={item.imageUrl} />
              )}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={true} // Add margin to separate the lists
            />

            {/* Links Section */}
            <View className="p-2">
              <Text className="text-lg font-semibold">Upcomming Events</Text>
            </View>

            <FlatList
              className="bg-white rounded-md p-2"
              data={events}
              renderItem={({ item }) => <HomescreenEvent event={item} />}
              keyExtractor={(event) => event.$id}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          </View>
        )}
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        } // Show vertical scroll indicator
      />

      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
