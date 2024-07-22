import Ionicons from "@expo/vector-icons/Ionicons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

export function TabBarIcon({
  color,
  name,
}: IconProps<ComponentProps<typeof Ionicons>["name"]>) {
  return <Ionicons name={name} size={24} className="-mb-3" color={color} />;
}
