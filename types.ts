export type Video = {
  id: string;
  video: string;
  thumbnail: string;
  title: string;
  creator: Creator;
};

export type Creator = {
  username: string;
  avatar: string;
  email: string;
  id: string;
};
