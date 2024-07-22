import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Eye, EyeOff, Search } from "lucide-react-native";
import { router, usePathname } from "expo-router";

export default function SearchInput({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery || "");
  const pathname = usePathname();

  return (
    <View className="border-2 border-black-200 w-full h-12 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base text-white flex-1"
        value={query}
        placeholder="Search for a video topic"
        onChangeText={setQuery}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (!query) return Alert.alert("Please enter a query.");
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Search size={20} className="text-gray-100" />
      </TouchableOpacity>
    </View>
  );
}
