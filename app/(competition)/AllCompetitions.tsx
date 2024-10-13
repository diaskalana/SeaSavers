import React, { useEffect, useState } from "react";
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
import waves from "../../assets/images/wave.jpeg";
import { router } from "expo-router";
import CompetitionListItem from "@/components/CompetitionListItem";
import { useGlobalContext } from "@/context/Globalprovider";
import { getCompetitions } from "@/lib/appwrite";
import HeaderTile from "@/components/HeaderTile";

interface Competition {
  $id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl?: string;
}

const AllCompetitions = () => {
  const { user } = useGlobalContext();

  if (user === null) {
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
    <SafeAreaView className="mt-8">
      <HeaderTile title="All Competitions" />
      <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
      <View className="mt-4">
        <View className="flex justify-center items-end p-4">
          <TouchableOpacity
            className="p-2 bg-primary rounded-lg"
            onPress={() => router.push("/(competition)/AddCompetition")}
          >
            <Text className="text-white">Add Competition</Text>
          </TouchableOpacity>
        </View>

        {competition.length === 0 && (
          <View className="flex justify-center items-center">
            <Text className="text-lg">No Competitions available</Text>
          </View>
        )}

        {competition.length > 0 && (
          <FlatList
            data={competition}
            renderItem={({ item }) => <CompetitionListItem {...item} />}
            keyExtractor={(event) => event.$id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
      <StatusBar translucent barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default AllCompetitions;
