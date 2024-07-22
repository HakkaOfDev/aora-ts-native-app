import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

export default function CustomButton({
  title,
  onPress,
  styles,
  isLoading,
}: {
  title: string;
  onPress: () => void;
  styles?: ClassValue;
  isLoading?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={cn(
        "bg-secondary rounded-xl min-h-[62px] justify-center items-center",
        isLoading && "opacity-50",
        styles
      )}
    >
      <Text className="text-primary font-bold text-lg">{title}</Text>
    </TouchableOpacity>
  );
}
