import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import waves from "../../assets/images/wave.jpeg";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/Globalprovider";
import { getBlogs } from "@/lib/appwrite";
import BlogListItem from "@/components/BlogListItem";
import { Header } from "react-native/Libraries/NewAppScreen";
import HeaderTile from "@/components/HeaderTile";

interface Blog {
  $id: string;
  title: string;
  category: [string];
  content: string;
  imgUrl: string;
}

const AllBlogs = () => {
  const { user } = useGlobalContext();

  if (user === null) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getBlogs();
    const data: Blog[] = documents.map((doc: any) => ({
      $id: doc.$id,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      imgUrl: doc.imgUrl,
    }));
    setBlogs(data);
  };

  useEffect(() => {
    getData();
  }, []);

  const refetch = async () => getData();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className="mt-8">
      <HeaderTile title="All Blogs" />
      <Image resizeMode="cover" source={waves} className="mt-0 w-full h-28" />
      <View className="mt-4">
        <View className="flex flex-row items-center justify-between p-4">
          <Text className="text-2xl text-left font-semibold">All Blogs</Text>
          <View className="flex justify-center items-end">
            <TouchableOpacity
              className="p-2 bg-primary rounded-lg"
              onPress={() => router.push("/(blog)/AddBlog")}
            >
              <Text className="text-white">Add Blog</Text>
            </TouchableOpacity>
          </View>
        </View>

        {blogs.length === 0 && (
          <View className="flex justify-center items-center">
            <Text className="text-lg">No Blogs available</Text>
          </View>
        )}

        {blogs.length > 0 && (
          <FlatList
            data={blogs}
            renderItem={({ item }) => <BlogListItem {...item} />}
            keyExtractor={(blog) => blog.$id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
      <StatusBar translucent barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default AllBlogs;
