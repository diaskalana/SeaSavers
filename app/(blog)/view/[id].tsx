import {
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/Globalprovider";
import { addComment, getBlogById, getComments } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SolidButton from "@/components/SolidButton";
import DisplayComments from "@/components/DisplayComments";
import { Ionicons } from "@expo/vector-icons";

interface Blog {
  $id: string;
  title: string;
  category: [string];
  content: string;
  imgUrl: string;
}

interface Comment {
  comment: string;
}

export default function ViewBlogScreen() {
  const { user } = useGlobalContext();

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const { id } = useLocalSearchParams() as { id: string };

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blog, setBlog] = React.useState<Blog>({
    $id: "",
    title: "",
    category: [""],
    content: "",
    imgUrl: "",
  });
  const [form, setForm] = React.useState<Comment>({
    comment: "",
  });

  const [isSubmitting, setSubmitting] = React.useState(false);

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

    setBlog(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const refetch = async () => getData();

  const onRefresh = async () => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
  };

  //submit comment
  const submit = async () => {
    if (form.comment === "") {
      alert("Please enter a comment");
      return;
    }
    setSubmitting(true);
    try {
      const newComment = await addComment(blog.$id, form.comment, {
        blogId: blog.$id,
        comment: form.comment,
      });

      if (newComment) {
        Alert.alert("Success", "Comment added successfully");

        setForm({
          comment: "",
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

  return isLoading ? (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg font-bold">Loading...</Text>
    </View>
  ) : (
    <SafeAreaView>
      <FlatList
        data={[1]} // Dummy data to create a single item for header
        renderItem={() => (
          <View className="">
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: blog.imgUrl }}
                resizeMode="cover"
                style={{
                  marginTop: 0,
                  width: "100%",
                  height: 248,
                  backgroundColor: "#D1D5DB",
                }}
              />
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ position: "absolute", top: 10, left: 10 }}
                className="p-1 bg-gray-200 rounded-full"
              >
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View className="px-4 mt-4">
              <View className="flex flex-row flex-wrap">
                {blog.category
                  .join(",")
                  .split(",")
                  .map((cat, index) => (
                    <View
                      key={index}
                      className="flex-col items-center rounded-full bg-primary px-3 py-1 mt-2 mr-2"
                    >
                      <Text className="text-white text-[11px] uppercase">
                        {cat.trim()}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>

            <View className="px-4 mt-6">
              <Text className="text-xl font-bold">{blog.title}</Text>
            </View>

            <View className="px-4 mt-8">
              <Text className="text-sm text-gray-600 text-justify">
                {blog.content}
              </Text>
            </View>

            <Text className="text-base text-gray-600 text-justify mt-4 px-4 font-bold">
              Tell us what you think about this blog ...
            </Text>

            <View className="px-4 mt-4">
              <View className="mt-2">
                <TextInput
                  placeholder="Write a comment"
                  value={form.comment}
                  onChangeText={(text) => setForm({ ...form, comment: text })}
                  multiline
                  numberOfLines={4}
                  className="w-full border border-gray-200 rounded-md p-2"
                />
              </View>
              <View className="mt-2">
                <SolidButton
                  title="Submit"
                  handlePress={() => {
                    submit();
                  }}
                  isLoading={isSubmitting}
                />
              </View>
            </View>

            <View className="px-4 mt-4">
              <Text className="text-lg font-bold">Comments</Text>
              <DisplayComments blogId={blog.$id} />
            </View>
          </View>
        )}
        keyExtractor={() => "header"}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
