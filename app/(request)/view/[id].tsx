import Loader from "@/components/Loader";
import { useGlobalContext } from "@/context/Globalprovider";
import { getRequestById } from "@/lib/appwrite";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams } from "expo-router";
import waves from "@/assets/images/wave.jpeg";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderTile from "@/components/HeaderTile";

interface Request {
  $id: string;
  fullName: string;
  email: string;
  phone: string;
  description: string;
  organizer: string;
}

export default function RequestDetailsScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    setIsLoading(true);
    const documents = await getRequestById(id as string);
    const data: Request[] = documents.map((doc: any) => ({
      $id: doc.$id,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      description: doc.description,
      organizer: doc.organizer,
    }));
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {requests.length == 0 && (
          <View className="flex justify-center items-center">
            <Loader isLoading={isLoading} />
          </View>
        )}
        {requests.length > 0 && (
          <>
            <HeaderTile title="Request Details" />
            <View style={{ position: "relative" }}>
              <Image
                source={waves}
                style={{ width: "100%", height: 100 }}
                resizeMode="cover"
              />
            </View>
            <View className="py-4 mt-4 px-6">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-2xl font-bold">
                  {requests[0].fullName}
                </Text>
                <FontAwesome name="user" size={24} color="#333" />
              </View>
              <View className="flex flex-row items-center mt-2">
                <FontAwesome name="envelope" size={16} color="#666" style={{ marginRight: 12 }}  />
                <Text style={{ color: "#666", fontSize: 16 }}>{requests[0].email}</Text>
              </View>
              <View className="flex flex-row items-center mt-2">
                <FontAwesome name="phone" size={16} color="#666" style={{ marginRight: 12 }} />
                <Text style={{ color: "#666", fontSize: 16 }}>{requests[0].phone}</Text>
              </View>
              <View className="flex flex-row items-center mt-2">
                <FontAwesome name="users" size={16} color="#666" style={{ marginRight: 12 }} />
                <Text style={{ color: "#666", fontSize: 16 }}>{requests[0].organizer}</Text>
              </View>
              <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center", paddingHorizontal:4, marginRight:12 }}>
                <FontAwesome name="info-circle" size={16} color="#666" style={{ marginRight: 8 }} />
                <Text className="text-base text-gray-800 text-justify">{requests[0].description}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
