import { Creator, Video } from "@/types";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_ID!,
  videosCollectionId: process.env.EXPO_PUBLIC_APPWRITE_VIDEOS_ID!,
  storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!,
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      newAccount.$id,
      {
        id: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );

    const user = {
      id: newUser.$id,
      username: newUser.username,
      avatar: newUser.avatar,
      email: newUser.email,
    } as Creator;

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) {
      throw new Error("Failed to sign in");
    }

    return session;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      currentAccount.$id
    );

    if (!currentUser) throw Error;

    const user = {
      id: currentUser.$id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      email: currentUser.email,
    } as Creator;

    return user;
  } catch (error) {
    throw error;
  }
};

export const getAllPosts = async (queries?: string[]) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      queries
    );

    const parsedPosts = posts.documents.map((post) => {
      return {
        id: post.$id,
        title: post.title,
        thumbnail: post.thumbnail,
        video: post.video,
        creator: {
          id: post.creator.$id,
          username: post.creator.username,
          avatar: post.creator.avatar,
          email: post.creator.email,
        } as Creator,
      } as Video;
    });

    return parsedPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTrendingPosts = async () => {
  const posts = await getAllPosts([
    Query.orderDesc("$createdAt"),
    Query.limit(7),
  ]);
  return posts;
};

export const searchPosts = async (query: string) => {
  const posts = await getAllPosts([Query.search("title", query)]);
  return posts;
};

export const getUserPosts = async (userId: string) => {
  const posts = await getAllPosts([Query.equal("creator", userId)]);
  return posts;
};

export async function uploadFile(file: any, type: string) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFilePreview(fileId: string, type: string) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createVideoPost({
  title,
  thumbnail,
  video,
  prompt,
  userId,
}: {
  title: string;
  thumbnail: any;
  video: any;
  prompt: string;
  userId: string;
}) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(thumbnail, "image"),
      uploadFile(video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      ID.unique(),
      {
        title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt,
        creator: userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const appwrite = client;
