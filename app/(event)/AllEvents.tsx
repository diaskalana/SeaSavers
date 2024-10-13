import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import { useGlobalContext } from "@/context/Globalprovider";
import { getEvents } from "@/lib/appwrite";
import EventListItem from "@/components/EventListItem";
import waves from "../../assets/images/wave.jpeg";
import { router } from "expo-router";
import HeaderTile from "@/components/HeaderTile";

interface Event {
  $id: string;
  id: number;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
}

const AllEvents: React.FC = () => {
  const { user } = useGlobalContext();

  if (user === null) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getEvents();
    const data: Event[] = documents.map((doc: any) => ({
      $id: doc.$id,
      id: doc.id,
      title: doc.title,
      type: doc.type,
      description: doc.description,
      date: doc.date,
      time: doc.time,
      location: doc.location,
      organizer: doc.organizer,
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
    <SafeAreaView className="mt-6">
      <HeaderTile title="All Events" />
      <Image resizeMode="cover" source={waves} className="mt-0 w-full h-32" />
      <View className="mt-4">
        <View className="px-6">
          <Text className="text-lg font-bold">All Events</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Here are all the events that are coming up. Click on an event to see
            more details.
          </Text>
        </View>
        <View className="flex justify-center items-end p-4">
          <TouchableOpacity
            className="p-2 bg-primary rounded-lg"
            onPress={() => router.push("/(event)/AddEvent")}
          >
            <Text className="text-white">Add Event</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 && (
          <View className="flex justify-center items-center">
            <Text className="text-lg text-gray-500">No events available</Text>
          </View>
        )}
        {events.length > 0 && (
          <FlatList
            data={events}
            renderItem={({ item }) => <EventListItem event={item} />}
            keyExtractor={(event) => event.$id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
};

export default AllEvents;
