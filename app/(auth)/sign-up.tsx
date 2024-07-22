import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createUser } from "@/lib/appwrite";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpPage = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const user = await createUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setUser(user);
      setIsLoggedIn(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error: ", (error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white font-semibold mt-10">
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            placeholder="HakkaOfDev"
            value={form.username}
            onChange={(value) => setForm({ ...form, username: value })}
            styles="mt-10"
          />

          <FormField
            title="Email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(value) => setForm({ ...form, email: value })}
            styles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(value) => setForm({ ...form, password: value })}
            styles="mt-7"
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign Up"
            onPress={submit}
            styles="mt-7"
            isLoading={isLoading}
          />

          <View className="justify-center pt-5 flex-row items-center gap-2">
            <Text className="text-lg text-gray-100">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-secondary text-lg font-semibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpPage;
