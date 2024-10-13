import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import { useGlobalContext } from "@/context/Globalprovider";
import { getEvents, getRequests } from "@/lib/appwrite";
import EventListItem from "@/components/EventListItem";
import waves from "../../assets/images/wave.jpeg";
import { router } from "expo-router";
import RequestListItem from "@/components/RequestListItem";
import HeaderTile from "@/components/HeaderTile";

interface Request {
  $id: string;
  fullName: string;
  email: string;
  phone: string;
  description: string;
  organizer: string;
}

const AllRequests: React.FC = () => {
  const { user } = useGlobalContext();

  if (user === null) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [requests, setRequests] = useState<Request[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getRequests();
    const data: Request[] = documents.map((doc: any) => ({
      $id: doc.$id,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      description: doc.description,
      organizer: doc.organizer,
    }));
    setRequests(data);
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
    <SafeAreaView className="mt-8">
      <HeaderTile title="All Requests" />
      <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
      <View className="mt-4">
        <View className="px-6">
          <Text className="text-lg font-bold">All Requests</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Here are all the requests that are submitted by the users. Click on
            an request to see more details.
          </Text>
        </View>

        {/* put the event list here inside a flatlist */}
        <FlatList
          className="mt-2"
          data={requests}
          renderItem={({ item }) => <RequestListItem request={item} />}
          keyExtractor={(event) => event.$id}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
};

export default AllRequests;
