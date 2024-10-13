import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/context/Globalprovider";
import SolidButton from "@/components/SolidButton";
import Loader from "@/components/Loader";

import logo from "@/assets/images/logo.png";
import card from "@/assets/images/card.png";
import React from "react";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/(tabs)/" />;

  return (
    <SafeAreaView className="bg-blue-50 h-full">
      <Loader isLoading={loading} />

      <ScrollView
        className=""
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={logo}
            className="w-[230px] h-[164px]"
            resizeMode="contain"
          />

          <Image
            source={card}
            className="max-w-[340px] h-[200px] mx-auto rounded-3xl"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-gray-800 font-bold text-center">
              Protect Our Shores with{"\n"}
              <Text className="text-primary">Sea Savers</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular text-gray-700 mt-7 text-center">
            Join the movement for cleaner beaches and a healthier ocean with Sea
            Savers
          </Text>

          <SolidButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
