import ProfileImage from "@/components/ProfileImage";
import { signOut } from "@/lib/appwrite";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/Globalprovider";
import { router } from "expo-router";
import AdminNavList from "@/components/AdminNavList";
import UserNavList from "@/components/UserNavList";
import React, { useCallback, useEffect } from "react";

export default function ProfileScreen() {
  const { user, setUser, setIsLogged, isAdmin, setIsAdmin } =
    useGlobalContext();

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "admin");
    }
  }, [user, setIsAdmin]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      setIsAdmin(false);
      router.push("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [setUser, setIsLogged, setIsAdmin]);

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView className="w-full h-full p-4">
      {user && (
        <ProfileImage
          fullName={user.username}
          username={user.username}
          logo={user.avatar}
        />
      )}

      <View className="space-y-4 bg-white rounded-lg my-4 shadow-lg shadow-blue-400">
        <View className="flex flex-row justify-between px-6 py-4 items-center">
          <View className="flex flex-row">
            <TouchableOpacity onPress={logout}>
              <Text className="text-red-600 text-base">Sign Out</Text>
            </TouchableOpacity>
          </View>
          <FontAwesome name="sign-out" size={20} color={"#8F9098"} />
        </View>
      </View>

      {isAdmin ? <AdminNavList /> : <UserNavList />}
    </SafeAreaView>
  );
}
