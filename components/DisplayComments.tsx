import React, { useEffect, useState } from "react";
import { Text, View, FlatList, RefreshControl, Image } from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/Globalprovider";
import { getComments } from "@/lib/appwrite";

interface Comment {
  $id: string;
  comment: string;
  blogId: string;
  user: {
    username: string;
    avatar: string;
  };
}

interface AllCommentsProps {
  blogId: string;
}

const AllComments: React.FC<AllCommentsProps> = ({ blogId }) => {
  const { user } = useGlobalContext();

  if (user === null) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const getData = async () => {
    const documents = await getComments(blogId);
    const data: Comment[] = documents.map((doc: any) => ({
      $id: doc.$id,
      comment: doc.comment,
      blogId: doc.blogId,
      user: doc.user,
    }));
    setComments(data);
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
    <FlatList
      data={comments}
      keyExtractor={(item) => item.$id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      renderItem={({ item }) => (
        <View className="bg-white shadow-md rounded-lg p-4 m-2">
          <View className="flex flex-row items-center mb-2">
            <Image
              source={{ uri: item.user.avatar }}
              className="w-10 h-10 rounded-full mr-2"
            />
            <Text className="text-base">@{item.user.username}</Text>
          </View>
          <Text className="text-gray-700">{item.comment}</Text>
        </View>
      )}
    />
  );
};

export default AllComments;
