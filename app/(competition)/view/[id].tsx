import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/Globalprovider";
import { getCompetitionById } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Competition {
  $id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imgUrl?: string;
  isActive?: boolean;
}

export default function ViewCompetitionScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [form, setForm] = React.useState<Competition>({
    $id: "",
    title: "",
    location: "",
    date: new Date(),
    time: "",
    description: "",
    imgUrl: "",
    isActive: false,
  });

  const getData = async () => {
    setIsLoading(true);
    const documents = await getCompetitionById(id as string);
    const document = documents[0];
    const data: Competition = {
      $id: document.$id,
      title: document.title,
      description: document.description,
      date: document.date,
      time: document.time,
      location: document.location,
      imgUrl: document.imgUrl,
      isActive: document.isActive,
    };
    setForm(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Loading...</Text>
    </View>
  ) : (
    <SafeAreaView>
      <ScrollView>
        <View className="">
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: form.imgUrl }}
              resizeMode="cover"
              style={{
                marginTop: 0,
                width: "100%",
                height: 248,
                backgroundColor: "#D1D5DB",
              }}
            />
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ position: "absolute", top: 10, left: 10 }}
              className="p-1 bg-gray-200 rounded-full"
            >
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <View className="px-4 mt-6">
            <Text className="text-xl font-bold">{form.title}</Text>
          </View>
          <View className="px-4">
            <Text className="text-base font-semibold text-gray-700">
              Date: {new Date(form.date).toISOString().split('T')[0]}
            </Text>
            <Text className="text-base font-semibold text-gray-700">
              Location: {form.location}
            </Text>
          </View>
          <View className="px-4 mt-8">
            <Text className="text-sm text-gray-600 text-justify">
              {form.description}
            </Text>
          </View>

          <View className="p-4">
            <TouchableOpacity
              onPress={() => router.push(`/(competition)/participate/${form.$id}`)}
              className={`flex justify-center items-center mt-8 py-2 rounded-xl ${
              form.isActive ? "bg-primary" : "bg-gray-400"
              }`}
              disabled={!form.isActive}
            >
              <Text className="text-lg font-bold text-white">Participate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
