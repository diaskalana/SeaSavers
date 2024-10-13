import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import waves from "@/assets/images/wave.jpeg";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { useGlobalContext } from "@/context/Globalprovider";
import { getEventById, updateEvent } from "@/lib/appwrite";
import SelectField from "@/components/SelectField";
import DateField from "@/components/DateField";
import HeaderTile from "@/components/HeaderTile";

interface Event {
  $id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  imgUrl: string;
}

export default function UpdateEventScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [form, setForm] = useState<Event>({
    $id: "",
    title: "",
    type: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    imgUrl: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitting] = React.useState(false);

  const getData = async () => {
    setIsLoading(true);
    const documents = await getEventById(id as string);
    const document = documents[0];
    const data: Event = {
      $id: document.$id,
      title: document.title,
      type: document.type,
      description: document.description,
      date: document.date,
      time: document.time,
      location: document.location,
      organizer: document.organizer,
      imgUrl: document.imgUrl,
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
      form.type === "" ||
      form.description === "" ||
      form.location === "" ||
      form.organizer === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const updatedEvent = await updateEvent(form);

      if (updatedEvent) {
        Alert.alert("Success", "Event updated successfully");
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
        <HeaderTile title="Update Event" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Fill the form</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Fill the following form in order to update an Event to the home
            page.
          </Text>

          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="Event Title"
              value={form.title}
              placeholder="Event Title"
              handleChangeText={(e: string) => {
                setForm({ ...form, title: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <SelectField
              title="Event Type"
              value={form.type}
              placeholder="Event Type"
              handleChange={(e: string) => {
                setForm({ ...form, type: e });
              }}
              otherStyles="mt-4"
              enabled={true}
              options={[
                { label: "Clean Up", value: "cleanup" },
                { label: "Workshop", value: "workshop" },
              ]}
            />


            <DateField
              title="Event Date"
              date={new Date(form.date)}
              handleDateChange={(date: Date) => {
                setForm({ ...form, date: date.toISOString() });
              }}
              otherStyles="mt-4"
            />

            <TextField
              title="Event Time"
              value={form.time}
              placeholder="Event Time"
              handleChangeText={(e: string) => {
                setForm({ ...form, time: e });
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

            <TextField
              title="Organizer"
              value={form.organizer}
              placeholder="Organizer"
              handleChangeText={(e: string) => {
                setForm({ ...form, organizer: e });
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
              value={form.imgUrl}
              placeholder="Image URL"
              handleChangeText={(e: string) => {
                setForm({ ...form, imgUrl: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <View className="flex flex-row">
              <View className="flex-1 flex-col">
                <SolidButton
                  title="Submit"
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
      <StatusBar translucent={true} barStyle={"dark-content"} />
    </SafeAreaView>
  );
}
