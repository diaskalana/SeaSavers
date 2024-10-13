import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import FormField from "../../components/AuthFormField";
import logo from "../../assets/images/logo.png";
import { Link, router } from "expo-router";
import SolidButton from "@/components/SolidButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { account, createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/Globalprovider";

export default function SignUpScreen() {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username); 
      setUser({
        id: result.$id,
        username: result.username,
        email: result.email,
        role: result.role || "user",
        avatar: result.avatar || "",
      });
      setIsLogged(true);

      router.replace("/(tabs)/");
      
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
      <ScrollView>
        <View className="w-full flex justify-center h-full px-4">
          <Image source={logo} resizeMode="contain" className="w-32 h-32" />
          <Text className="text-2xl text-center font-semibold mt-10">
            Register
          </Text>

          <View className="p-2">
            <FormField
              title="User"
              value={form.username}
              placeholder="Username"
              handleChangeText={(e: string) => {
                setForm({ ...form, username: e });
              }}
              otherStyles="mt-7"
              keyboardType="default"
            />
            <FormField
              title="Email"
              value={form.email}
              placeholder="Email"
              handleChangeText={(e: string) => {
                setForm({ ...form, email: e });
              }}
              otherStyles="mt-3"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              placeholder="Password"
              handleChangeText={(e: string) => {
                setForm({ ...form, password: e });
              }}
              otherStyles="mt-3"
              secureTextEntry={true}
            />

            <SolidButton
              title="Register"
              handlePress={submit}
              containerStyles="mt-12"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-base font-normal text-gray-600">
                Already a member?
              </Text>
              <Link href="/sign-in" className="text-base text-primary">
                Login now
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
