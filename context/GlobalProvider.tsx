import { getCurrentUser } from "@/lib/appwrite";
import { Creator } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

type ContextType = {
  isLoggedIn: boolean;
  user: Creator | null;
  isLoading: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: Creator | null) => void;
};

const GlobalContext = createContext<ContextType>({
  isLoggedIn: false,
  user: null,
  isLoading: true,
  setIsLoggedIn: () => {},
  setUser: () => {},
});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setUser(user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
