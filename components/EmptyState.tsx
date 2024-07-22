import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

export default function EmptyState({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[215px]"
      />
      <Text className="text-white font-semibold text-center text-2xl mt-2">
        {title}
      </Text>
      <Text className="text-gray-100 font-medium text-sm">{subTitle}</Text>

      <CustomButton
        title="Create a Video"
        onPress={() => router.push("/create")}
        styles="w-full my-5"
      />
    </View>
  );
}
