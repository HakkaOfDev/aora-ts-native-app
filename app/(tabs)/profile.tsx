import { Redirect } from "expo-router";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "@/components/EmptyState";
import VideoCard from "@/components/VideoCard";
import InfoBox from "@/components/navigation/InfoBox";
import { LogOut } from "lucide-react-native";
import useSWR from "swr";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getUserPosts, signOut } from "../../lib/appwrite";
import Loader from "@/components/Loader";

const Profile = () => {
  const { user, isLoading, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, isLoading: isLoadingPosts } = useSWR(
    user?.id ? `user-posts/${user.id}` : null,
    () => getUserPosts(user!.id),
    {
      revalidateOnFocus: false,
    }
  );

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  if (!user && !isLoading) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoadingPosts} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subTitle="No videos found for this profile"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress={logout}
              className="flex w-full items-end mb-10"
            >
              <LogOut size={24} className="text-red-500" />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user!.username}
              subtitle="Username"
              containerClassName="mt-5"
              titleClassName="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleClassName="text-xl"
                containerClassName="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleClassName="text-xl"
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
