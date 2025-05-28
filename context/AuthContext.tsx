import { account } from "@/lib/appwrite";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";

type ContextType = {
  children: React.ReactNode;
};

type AuthContextType = {
  isLoading: boolean;
  user: Models.User<Models.Preferences> | null;
  signout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<undefined | string>;
  signin: (email: string, password: string) => Promise<undefined | string>;
};

const Context = createContext<AuthContextType | undefined>(undefined);

const AuthContext: React.FC<ContextType> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await account.get();
      setUser(session);
    } catch (e) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signin(email, password);
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Something went wrong during signup";
    }
  };

  const signin = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Something went wrong during signin";
    }
  };

  return (
    <Context.Provider value={{ signin, signup, user, isLoading, signout }}>
      {children}
    </Context.Provider>
  );
};

export default memo(AuthContext);

export const useAuth = () => {
  const ctx = useContext(Context);
  if (ctx === undefined) {
    throw new Error("Somethng went wrong");
  }
  return ctx;
};
