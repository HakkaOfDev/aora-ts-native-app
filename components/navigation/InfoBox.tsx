import { cn } from "@/lib/utils";
import { View, Text } from "react-native";

const InfoBox = ({
  title,
  subtitle,
  containerClassName,
  titleClassName,
}: {
  title: string | number;
  subtitle: string;
  containerClassName?: string;
  titleClassName?: string;
}) => {
  return (
    <View className={containerClassName}>
      <Text
        className={cn("text-white text-center font-semibold", titleClassName)}
      >
        {title}
      </Text>
      <Text className="text-sm text-gray-100 text-center">{subtitle}</Text>
    </View>
  );
};

export default InfoBox;
