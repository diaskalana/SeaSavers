import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import waves from "../../assets/images/wave.jpeg";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/Globalprovider";
import {  getEntries } from "@/lib/appwrite";
import EntriesListItem from "@/components/EntriesListItem";
import HeaderTile from "@/components/HeaderTile";

interface Entry {
  $id: string;
  user: {
    username: string;
  };
  competition: {
    title: string;
  };
  totItems: number;
  totPoints: number;
  note: string;
}

const AllCompEntries = () => {
  const { user } = useGlobalContext();

  if (user === null) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [entries, setEntries] = useState<Entry[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getEntries();
    const data: Entry[] = documents.map((doc: any) => ({
      $id: doc.$id,
      user: doc.user,
      competition: doc.competition,
      totItems: doc.totItems,
      totPoints: doc.totPoints,
      note: doc.note,
    }));
    setEntries(data);
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
      <HeaderTile title="All Competition Entries" />
      <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
      <View className="p-4">
        <Text className="text-xl font-semibold text-left">Competition Entries</Text>
      </View>
      <View className="mt-4">
        {entries.length === 0 && (
          <View className="flex justify-center items-center">
            <Text className="text-lg">No Competition Entries available</Text>
          </View>
        )}

        {entries.length > 0 && (
          <FlatList
            data={entries}
            renderItem={({ item }) => <EntriesListItem entry={item} />}
            keyExtractor={(event) => event.$id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
      <StatusBar translucent={true} barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default AllCompEntries;
