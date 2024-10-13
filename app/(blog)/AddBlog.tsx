import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import waves from "../../assets/images/wave.jpeg";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { addBlog } from "@/lib/appwrite";
import HeaderTile from "@/components/HeaderTile";

export default function AddBlogScreen() {
  const [isSubmitting, setSubmitting] = React.useState(false);

  const [form, setForm] = React.useState<{
    title: string;
    category: [string];
    content: string;
    imgUrl: string;
  }>({
    title: "",
    category: [""],
    content: "",
    imgUrl: "",
  });

  const submit = async () => {
    if (form.title === "" || form.content === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const newBlog = await addBlog(form);

      if (newBlog) {
        Alert.alert("Success", "Blog added successfully");

        setForm({
          title: "",
          category: [""],
          content: "",
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
        <HeaderTile title="Add Blog Post" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Add Blog Post</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Create a blog post and show it in the news feed
          </Text>

          <View className="border mt-5 p-4 mb-7 border-dashed border-gray-400">
            <TextField
              title="Post Title"
              value={form.title}
              placeholder="Title"
              handleChangeText={(e: string) => {
                setForm({ ...form, title: e });
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
              title="Category"
              value={form.category.join(",")}
              placeholder="Category"
              handleChangeText={(e: string) => {
                setForm({ ...form, category: [e] });
              }}
              otherStyles="mt-4"
              keyboardType="default"
            />

            <TextField
              title="Content"
              value={form.content}
              placeholder="Content"
              handleChangeText={(e: string) => {
                setForm({ ...form, content: e });
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
        <StatusBar translucent barStyle={'dark-content'} />
      </ScrollView>
    </SafeAreaView>
  );
}
