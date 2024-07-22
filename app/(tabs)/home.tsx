import EmptyState from "@/components/EmptyState";
import { HelloWave } from "@/components/HelloWave";
import Loader from "@/components/Loader";
import SearchInput from "@/components/SearchInput";
import Trending from "@/components/Trending";
import VideoCard from "@/components/VideoCard";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getAllPosts, getTrendingPosts } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

export default function Home() {
  const { user, isLoading } = useGlobalContext();

  const {
    data: posts,
    isLoading: isLoadingPosts,
    mutate: refreshPosts,
  } = useSWR("posts", () => getAllPosts(), {
    revalidateOnFocus: false,
  });

  const {
    data: trendingPosts,
    isLoading: isLoadingTrendingPosts,
    mutate: refreshTrendingPosts,
  } = useSWR("trending-posts", () => getTrendingPosts(), {
    revalidateOnFocus: false,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPosts();
    await refreshTrendingPosts();
    setRefreshing(false);
  };

  if (!user && !isLoading) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoadingPosts || isLoadingTrendingPosts} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-4 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-4">
              <View>
                <Text className="font-medium text-sm text-gray-100">
                  Welcome back!
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  {user!.username} <HelloWave />
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <Trending posts={trendingPosts ?? []} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subTitle="Create a video to get started"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
