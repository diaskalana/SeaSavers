import { View, Text, ScrollView, Image, StatusBar, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import waves from "@/assets/images/wave.jpeg";
import TextField from "@/components/TextField";
import SolidButton from "@/components/SolidButton";
import { useGlobalContext } from "@/context/Globalprovider";
import { router, useLocalSearchParams } from "expo-router";
import {
  getBlogById,
  getCompetitionById,
  updateBlog,
  updateCompetition,
} from "@/lib/appwrite";
import HeaderTile from "@/components/HeaderTile";

interface Blog {
  $id: string;
  title: string;
  category: [string];
  content: string;
  imgUrl: string;
}

export default function UpdateBlogScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const [form, setForm] = React.useState<Blog>({
    $id: "",
    title: "",
    category: [""],
    content: "",
    imgUrl: "",
  });

  const getData = async () => {
    setIsLoading(true);
    const documents = await getBlogById(id as string);
    const document = documents[0];
    const data: Blog = {
      $id: document.$id,
      title: document.title,
      category: document.category,
      content: document.content,
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
      form.content === "" ||
      form.imgUrl === "" ||
      form.category[0] === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);

    try {
      const updatedBlog = await updateBlog(form);

      if (updatedBlog) {
        Alert.alert("Success", "Blog updated successfully");
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
        <HeaderTile title="Update Blog Post" />
        <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
        <View className="px-6 mt-4">
          <Text className="text-lg font-bold">Edit Blog Post</Text>
          <Text className="mt-2 text-sm text-justify text-gray-500">
            Edit the blog post and show it in the news feed
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
              title="Content"
              value={form.content}
              placeholder="Content"
              handleChangeText={(e: string) => {
                setForm({ ...form, content: e });
              }}
              otherStyles="mt-4"
              keyboardType="default"
              multiline={true}
              numberOfLines={4}
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
        <StatusBar translucent={true} barStyle={'dark-content'}/>
      </ScrollView>
    </SafeAreaView>
  );
}
