import EmptyState from "@/components/EmptyState";
import Loader from "@/components/Loader";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { searchPosts } from "@/lib/appwrite";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useSWR from "swr";

export default function SearchPage() {
  const { query } = useLocalSearchParams();

  const { data: posts, isLoading } = useSWR(
    query ? `search/${query}` : null,
    () => searchPosts(query as string)
  );

  if (!query) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-4 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">
                Search results for:
              </Text>
              <Text className="text-2xl font-psemibold text-white mt-1">
                {query}
              </Text>

              <View className="mt-6 mb-8 space-y-2">
                <SearchInput initialQuery={query as string} />
                <Link
                  href="/home"
                  className="text-secondary text-sm text-center"
                >
                  Back to Home
                </Link>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subTitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
}
