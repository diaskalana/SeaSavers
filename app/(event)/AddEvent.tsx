import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import waves from "../../assets/images/wave.jpeg";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { addEvent } from "@/lib/appwrite";
import SelectField from "@/components/SelectField";
import DateField from "@/components/DateField";
import HeaderTile from "@/components/HeaderTile";

export default function AddEventScreen() {
  const [form, setForm] = React.useState({
    title: "",
    type: "",
    description: "",
    // date: new Date(),
    // time: new Date(),
    date: new Date(),
    time: "",
    location: "",
    organizer: "",
    imgUrl: "",
  });
  const [isSubmitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    // is values empty
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

    // Implement the submit logic here
    setSubmitting(true);

    try {
      const newEvent = await addEvent(form);

      if (newEvent) {
        Alert.alert("Success", "Event added successfully");

        //clean up the form
        setForm({
          title: "",
          type: "",
          description: "",
          date: new Date(),
          // time: new Date(),
          // date: "",
          time: "",
          location: "",
          organizer: "",
          imgUrl: "",
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
        <HeaderTile title="Add Event" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Fill the form</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Fill the following form in order to add an Event to the home page
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
              placeholder="Select Event Type"
              options={[
                { label: "Clean Up", value: "cleanup" },
                { label: "Workshop", value: "workshop" },
              ]}
              handleChange={(value: string) => {
                setForm({ ...form, type: value });
              }}
              otherStyles="mt-4"
            />
            <DateField
              title="Event Date"
              date={form.date}
              handleDateChange={(date: Date) =>
                setForm({ ...form, date })
              }
              otherStyles="mt-4"
            />

            {/* <TextField
              title="Event Date"
              value={form.date}
              placeholder="Event Date"
              handleChangeText={(e: string) => {
                setForm({ ...form, date: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            /> */}

            {/* <TimeField
              title="Event Time"
              time={form.time}
              handleTimeChange={(time: Date) => setForm({ ...form, time })}
              otherStyles="mt-4"
            /> */}

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
              title="Image URL"
              value={form.imgUrl}
              placeholder="Image URL"
              handleChangeText={(e: string) => {
                setForm({ ...form, imgUrl: e });
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
              numberOfLines={8}
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
        <StatusBar translucent={true} barStyle={"dark-content"} />
      </ScrollView>
    </SafeAreaView>
  );
}
