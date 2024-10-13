import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import waves from "@/assets/images/wave.jpeg";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { useGlobalContext } from "@/context/Globalprovider";
import { router, useLocalSearchParams } from "expo-router";
import { getCompetitionById, updateCompetition } from "@/lib/appwrite";
import DateField from "@/components/DateField";
import SelectField from "@/components/SelectField";
import HeaderTile from "@/components/HeaderTile";

interface Competition {
  $id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imgUrl?: string;
  isActive: boolean;
}

export default function UpdateCompetitionScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitting] = React.useState(false);
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

  const submit = async () => {
    if (
      form.title === "" ||
      form.description === "" ||
      form.date === null ||
      form.time === "" ||
      form.location === "" ||
      form.imgUrl === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const updatedCompetition = await updateCompetition(form);

      if (updatedCompetition) {
        Alert.alert("Success", "Competition updated successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
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
        <HeaderTile title="Update Competition" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Fill the form</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Fill the following form in order to update a Competition to the home
            page
          </Text>

          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="Competition Title"
              value={form.title}
              placeholder="Competition Title"
              handleChangeText={(e: string) => {
                setForm({ ...form, title: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />
            <TextField
              title="Location"
              value={form.location}
              placeholder="Location"
              handleChangeText={(e: string) => {
                setForm({ ...form, location: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <DateField
              title="Date"
              date={new Date(form.date)}
              handleDateChange={(date: Date) => {
                setForm({ ...form, date });
              }}
              otherStyles="mt-4"
            />

            <TextField
              title="Time"
              value={form.time}
              placeholder="Time"
              handleChangeText={(e: string) => {
                setForm({ ...form, time: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <TextField
              title="Description"
              value={form.description}
              placeholder="Description"
              handleChangeText={(e: string) => {
                setForm({ ...form, description: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
              multiline={true}
              numberOfLines={4}
            />

            <TextField
              title="Image URL"
              value={form.imgUrl || ""}
              placeholder="Image URL"
              handleChangeText={(e: string) => {
                setForm({ ...form, imgUrl: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <SelectField
              title="Active"
              value={form.isActive.toString()}
              handleChange={(e: string) => {
                setForm({ ...form, isActive: e === "true" });
              }}
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              otherStyles="mt-4"
              placeholder={""}
            />

            <View className="flex flex-row">
              <View className="flex-1 flex-col">
                <SolidButton
                  title="Update"
                  handlePress={() => {
                    submit();
                  }}
                  containerStyles="mt-6"
                  isLoading={isSubmitting}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
