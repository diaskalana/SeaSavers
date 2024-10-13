import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView, StatusBar } from "react-native";
import FormField from "../../components/AuthFormField";
import logo from "../../assets/images/logo.png";
import { Link, router } from "expo-router";
import SolidButton from "@/components/SolidButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/Globalprovider";

const SignIn = () => {
  const { setUser, setIsLogged, setIsAdmin } = useGlobalContext();

  const [form, setForm] = useState({ phone: "", email: "", password: "" });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      if (result) {
        setUser({
          id: result.$id,
          username: result.name,
          email: result.email,
          role: result.role,
          avatar: result.avatar,
        });
        setIsAdmin(result.role === "admin");
      } else {
        Alert.alert("Error", "Failed to retrieve user information");
      }
      setIsLogged(true);
      Alert.alert("Success", "User signed in successfully");
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
            Log in
          </Text>

          <View className="p-2">
            <FormField
              title="Email"
              value={form.email}
              placeholder="Email"
              handleChangeText={(e: string) => {
                setForm({ ...form, email: e });
              }}
              otherStyles="mt-7"
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
              title="Login"
              handlePress={submit}
              containerStyles="mt-12"
              isLoading={isSubmitting}
            />

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-base font-normal text-gray-600">
                Not a member?
              </Text>
              <Link href="/sign-up" className="text-base text-primary">
                Register now
              </Link>
            </View>
          </View>
        </View>
        <StatusBar translucent barStyle={'dark-content'} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
