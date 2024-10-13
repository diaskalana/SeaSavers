import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  TouchableOpacity,
} from "react-native";
import waves from "@/assets/images/wave.jpeg";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { useGlobalContext } from "@/context/Globalprovider";
import {
  getEntryById,
  getEventById,
  updateEntry,
  updateEvent,
} from "@/lib/appwrite";
import HeaderTile from "@/components/HeaderTile";

interface Entry {
  $id: string;
  user: {
    $id: string;
    username: string;
  };
  competition: {
    $id: string;
    title: string;
  };
  totItems: number;
  totPoints: number;
  note: string;
  isValid: boolean;
}

export default function UpdateEntryScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [form, setForm] = useState<Entry>({
    $id: "",
    user: {
      $id: "",
      username: "",
    },
    competition: {
      $id: "",
      title: "",
    },
    totItems: 0,
    totPoints: 0,
    note: "",
    isValid: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const getData = async () => {
    setIsLoading(true);
    const documents = await getEntryById(id as string);
    const document = documents[0];
    const data: Entry = {
      $id: document.$id,
      user: document.user,
      competition: document.competition,
      totItems: document.totItems,
      totPoints: document.totPoints,
      note: document.note,
      isValid: document.isValid,
    };
    setForm(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  // const submit = async (updatedForm: {
  //   isValid: boolean;
  //   $id: string;
  //   user: {
  //     $id: string;
  //     username: string;
  //   };
  //   competition: {
  //     $id: string;
  //     title: string;
  //   };
  //   totItems: number;
  //   totPoints: number;
  //   note: string;
  // }) => {
  //   if (
  //     form.user.username === "" ||
  //     form.competition.title === "" ||
  //     form.totItems === 0 ||
  //     form.totPoints === 0 ||
  //     form.note === ""
  //   ) {
  //     Alert.alert("Error", "Please fill in all fields");
  //     return;
  //   }
  //   setSubmitting(true);

  //   try {
  //     console.log("form from frontend", form.isValid);
  //     const updatedEntry = await updateEntry(form);

  //     if (updatedEntry && form.isValid === true) {
  //       Alert.alert("Success", "Entry approved successfully");
  //     }

  //     if (updatedEntry && form.isValid === false) {
  //       Alert.alert("Success", "Entry rejected successfully");
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       Alert.alert("Error", error.message);
  //     } else {
  //       Alert.alert("Error", "An unknown error occurred");
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const approve = async () => {
    const approve = await updateEntry({ ...form, isValid: true });
    if (approve) {
      Alert.alert("Success", "Entry approved successfully");
    }
  };

  const reject = async () => {
    const reject = await updateEntry({ ...form, isValid: false });
    if (reject) {
      Alert.alert("Success", "Entry rejected successfully");
    }
  };

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Loading...</Text>
    </View>
  ) : (
    <SafeAreaView>
      <ScrollView className="">
        <HeaderTile title="Update Entry" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="User"
              value={form.user.username}
              placeholder="User"
              handleChangeText={(text) =>
                setForm({
                  ...form,
                  user: {
                    username: text,
                    $id: form.user.$id,
                  },
                })
              }
              editable={false}
            />
            <TextField
              title="Competition"
              value={form.competition.title}
              placeholder="Competition"
              handleChangeText={(text) =>
                setForm({
                  ...form,
                  competition: {
                    title: text,
                    $id: form.competition.$id,
                  },
                })
              }
              editable={false}
            />
            <TextField
              title="Total Items"
              value={form?.totItems.toString() || ""}
              placeholder="Total Items"
              handleChangeText={(text) =>
                setForm({ ...form, totItems: parseInt(text) })
              }
              editable={false}
            />
            <TextField
              title="Total Points"
              value={form.totPoints.toString()}
              placeholder="Total Points"
              handleChangeText={(text) =>
                setForm({ ...form, totPoints: parseInt(text) })
              }
              editable={false}
            />
            <TextField
              title="Note"
              value={form.note}
              placeholder="Note"
              handleChangeText={(text) => setForm({ ...form, note: text })}
              multiline={true}
              numberOfLines={4}
              editable={false}
            />

            <View className="flex-row justify-between mt-4">
              <TouchableOpacity
              onPress={() => {
                approve();
              }}
              className="flex-1 bg-primary p-4 rounded mr-2"
              >
              <Text className="text-white text-center">Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() => {
                reject();
              }}
              className="flex-1 bg-red-500 p-4 rounded ml-2"
              >
              <Text className="text-white text-center">Reject</Text>
              </TouchableOpacity>
            </View>
          
          </View>
        </View>
      </ScrollView>
      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
