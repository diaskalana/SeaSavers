import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { Icon1, Icon2, Icon3, Icon4, Icon5, Icon6 } from "@/assets/icons/index";
import { useGlobalContext } from "@/context/Globalprovider";
import { addEntry, getCompetitionById } from "@/lib/appwrite";
import TextField from "@/components/TextField";

interface Entry {
  $id: string;
  user: { $id: string };
  competition: { $id: string };
  totItems: number;
  totPoints: number;
  note: string;
}

interface Competition {
  $id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl?: string;
}

const CompetitionDashboard = () => {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const [competitionData, setCompetitionData] = useState<Competition>({
    $id: "",
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    imgUrl: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      title: "Item 1",
      points: 0,
      clicks: 0,
      image: Icon1,
      pointsPerClick: 3,
    },
    {
      id: 2,
      title: "Item 2",
      points: 0,
      clicks: 0,
      image: Icon2,
      pointsPerClick: 4,
    },
    {
      id: 3,
      title: "Item 3",
      points: 0,
      clicks: 0,
      image: Icon3,
      pointsPerClick: 5,
    },
    {
      id: 4,
      title: "Item 4",
      points: 0,
      clicks: 0,
      image: Icon4,
      pointsPerClick: 6,
    },
    {
      id: 5,
      title: "Item 5",
      points: 0,
      clicks: 0,
      image: Icon5,
      pointsPerClick: 7,
    },
    {
      id: 6,
      title: "Item 6",
      points: 0,
      clicks: 0,
      image: Icon6,
      pointsPerClick: 8,
    },
  ]);

  const [form, setForm] = useState<Entry>({
    $id: "",
    user: { $id: user.id },
    competition: { $id: id },
    totItems: 0,
    totPoints: 0,
    note: "",
  });

  const [isSubmitting, setSubmitting] = useState(false);

  const fetchCompetitionData = async () => {
    setIsLoading(true);
    try {
      const [document] = await getCompetitionById(id);
      setCompetitionData({
        $id: document.$id,
        title: document.title,
        description: document.description,
        date: document.date,
        time: document.time,
        location: document.location,
        imgUrl: document.imgUrl,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitionData();
  }, []);

  const handleTouch = useCallback(
    (id: number) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? {
                ...item,
                points: item.points + item.pointsPerClick,
                clicks: item.clicks + 1,
              }
            : item
        )
      );
    },
    [setItems]
  );

  const totalClicks = items.reduce((acc, item) => acc + item.clicks, 0);
  const totalPoints = items.reduce((acc, item) => acc + item.points, 0);

  const resetForm = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, points: 0, clicks: 0 }))
    );
    setForm({
      $id: "",
      user: { $id: user.id },
      competition: { $id: id },
      totItems: 0,
      totPoints: 0,
      note: "",
    });
  };

  const submit = async () => {
    if (totalClicks === 0 || totalPoints === 0 || form.note === "") {
      Alert.alert(
        "Error",
        "Please fill out all fields and interact with the items."
      );
      return;
    }

    setSubmitting(true);
    try {
      const updatedForm = {
        ...form,
        totItems: totalClicks,
        totPoints: totalPoints,
      };

      await addEntry(updatedForm);
      Alert.alert("Success", "Entry added successfully");
      resetForm();
      
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Loading...</Text>
    </View>
  ) : (
    <SafeAreaView>
      <ScrollView className="">
        <View className="p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1 bg-gray-200 rounded-full absolute top-3 left-3"
          >
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <View className="p-2 mt-6">
            <Text className="text-xl font-semibold text-center">
              {competitionData.title}
            </Text>
          </View>

          <View className="bg-primary p-4 my-6 rounded-2xl">
            <View className="flex flex-row justify-between mb-2">
              <Text className="text-white text-base font-semibold">
                No of Items: {totalClicks}
              </Text>
              <Text className="text-white text-base font-semibold">
                Total Points: {totalPoints}
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2 mb-2">
              <TouchableOpacity
                className="p-2 bg-blue-300 rounded-lg"
                onPress={() => {
                  router.push("/(competition)/LeaderBoard");
                }}
              >
                <Text className="text-white">Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-base font-semibold text-left px-2">
            Item Categories
          </Text>

          <View className="flex-1 justify-center items-center bg-white rounded-xl shadow-lg shadow-blue-950 p-2 my-4">
            <View className="flex-row flex-wrap justify-between">
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="relative w-1/4 py-2 px-2 m-2 rounded-full"
                  onPress={() => handleTouch(item.id)}
                >
                  <Image source={item.image} className="w-16 h-16" />
                  <View className="absolute top-0 right-0 bg-blue-500 w-6 h-6 rounded-full justify-center items-center">
                    <Text className="text-white text-xs">{item.clicks}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex mt-4">
            <TextField
              title="Note"
              value={form.note}
              placeholder="Note"
              handleChangeText={(text) => setForm({ ...form, note: text })}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              className="flex justify-center items-center mt-4 bg-primary py-2 rounded-xl"
              onPress={submit}
              disabled={isSubmitting}
            >
              <Text className="text-lg font-bold text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompetitionDashboard;
