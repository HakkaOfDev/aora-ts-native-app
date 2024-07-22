import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, Text } from "react-native";

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="flex-1 items-center justify-center dark:bg-slate-800"
    >
      <Text selectable={false} className="dark:text-white">
        {colorScheme === "dark" ? "🌙" : "🌞"}
      </Text>
    </Pressable>
  );
}

export default ThemeToggle;
