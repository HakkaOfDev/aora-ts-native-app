import {
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Eye, EyeOff } from "lucide-react-native";

export default function FormField({
  title,
  value,
  placeholder,
  onChange,
  styles,
  keyboardType,
  secureTextEntry,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  styles?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={cn("space-y-2", styles)}>
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      <View className="border-2 border-black-200 w-full h-14 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-white font-semibold text-base"
          value={value}
          placeholder={placeholder}
          onChangeText={onChange}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={28} className="text-gray-100" />
            ) : (
              <Eye size={28} className="text-gray-100" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
