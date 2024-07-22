import { Video } from "@/types";
import { ResizeMode, Video as VideoPlayer } from "expo-av";
import { Play } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function Trending({ posts }: { posts: Video[] }) {
  const [activeItem, setActiveItem] = useState<string | null>(
    posts[1]?.id ?? null
  );

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: any[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <View className="w-full flex-1 pt-6 pb-8">
      <Text className="text-gray-100 text-lg mb-2">Trending Videos</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrendingItem post={item} activeItem={activeItem} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,
        }}
        contentOffset={{ x: 160, y: 0 }}
        horizontal
      />
    </View>
  );
}

const zoomIn: any = {
  0: {
    scaleX: 0.9,
    scaleY: 0.9,
  },
  1: {
    scaleX: 1,
    scaleY: 1,
  },
};

const zoomOut: any = {
  0: {
    scaleX: 1,
    scaleY: 1,
  },
  1: {
    scaleX: 0.9,
    scaleY: 0.9,
  },
};

const TrendingItem = ({
  post,
  activeItem,
}: {
  post: Video;
  activeItem: string | null;
}) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-2"
      animation={activeItem === post.id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <VideoPlayer
          source={{ uri: post.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: post.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <View className="absolute w-12 h-12 flex items-center justify-center bg-gray-500/50 rounded-full">
            <Play size={24} className="text-white" />
          </View>
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
