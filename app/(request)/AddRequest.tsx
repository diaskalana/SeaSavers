import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import waves from "@/assets/images/wave.jpeg"; // Adjust the path as necessary
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Link, router } from "expo-router";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { addRequest } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import HeaderTile from "@/components/HeaderTile";

export default function AddRequestScreen() {
  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    organizer: "",
    description: "",
  });

  const [isSubmitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (
      form.fullName === "" ||
      form.email === "" ||
      form.phone === "" ||
      form.organizer === "" ||
      form.description === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const newEvent = await addRequest(form);
      if (newEvent) {
        Alert.alert("Success", "Request added successfully");

        setForm({
          fullName: "",
          email: "",
          phone: "",
          organizer: "",
          description: "",
        });
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

  return (
    <SafeAreaView>
      <ScrollView className="">
        <HeaderTile title="Request Event" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-32" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Fill the form</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Fill the following form to request an event to be created, One of our
            member will be in touch with you very shortly.
          </Text>

          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="Full Name"
              value={form.fullName}
              placeholder="Full Name"
              handleChangeText={(e: string) => {
                setForm({ ...form, fullName: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />
            <TextField
              title="Email"
              value={form.email}
              placeholder="Email"
              handleChangeText={(e: string) => {
                setForm({ ...form, email: e });
              }}
              otherStyles="mt-4"
              keyboardType="email-address"
            />
            <TextField
              title="Phone"
              value={form.phone}
              placeholder="Phone"
              handleChangeText={(e: string) => {
                setForm({ ...form, phone: e });
              }}
              otherStyles="mt-4"
              keyboardType="phone-pad"
            />
            <TextField
              title="Organization"
              value={form.organizer}
              placeholder="Organization"
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
              numberOfLines={5}
            />

            <View className="flex flex-row">
              <View className="flex-1 flex-col">
                <SolidButton
                  title="Submit"
                  handlePress={() => {submit()}}
                  containerStyles="mt-6"
                  isLoading={isSubmitting}
                />
              </View>
            </View>

          </View>
        </View>
        <StatusBar translucent={true} barStyle={"dark-content"}/>
      </ScrollView>
    </SafeAreaView>
  );
}
