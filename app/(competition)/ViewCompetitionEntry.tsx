import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Link } from "expo-router";
import waves from "../../assets/images/wave.jpeg";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";

export default function CompetitionEntryScreen() {
  const [form, setForm] = React.useState({
    username: "",
    competition: "",
    date: "",
    time: "",
    notes: "",
  });

  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <ScrollView className="-mt-10">
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-32" />
        <View className="px-6 mt-4">
          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="Username"
              value={form.username}
              placeholder="Username"
              handleChangeText={(e: string) => {
                setForm({ ...form, username: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <TextField
              title="Competition"
              value={form.competition}
              placeholder="Competition"
              handleChangeText={(e: string) => {
                setForm({ ...form, competition: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <TextField
              title="Date"
              value={form.date}
              placeholder="Date"
              handleChangeText={(e: string) => {
                setForm({ ...form, date: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
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
              title="Notes"
              value={form.notes}
              placeholder="Notes"
              handleChangeText={(e: string) => {
                setForm({ ...form, notes: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <View className="flex flex-row">
              <View className="flex-1 flex-col">
                <SolidButton
                  title="Approve"
                  handlePress={() => {}}
                  containerStyles="mt-6"
                  isLoading={false}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
