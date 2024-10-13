import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCurrentUser } from "../lib/appwrite";

// Define the structure of the context
interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null; // Assuming 'User' is a type returned by getCurrentUser
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define User type based on the shape of the data returned by getCurrentUser
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
}

// Initialize the context with default values
const GlobalContext = createContext<GlobalContextType>({
  isLogged: false,
  setIsLogged: () => {},
  user: null,
  setUser: () => {},
  loading: true,
  isAdmin: false,
  setIsAdmin: () => {},
});

// Create a custom hook to access the global context
export const useGlobalContext = () => useContext(GlobalContext);

// Type the props for GlobalProvider
interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }): React.ReactElement => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser({
            id: res.$id,
            username: res.username,
            email: res.email,
            role: res.role,
            avatar: res.avatar,
          });
          if (res.roles) {
            setIsAdmin(res.roles.includes("admin"));
          }
        } else {
          setIsLogged(false);
          setUser(null);
          setIsAdmin(false);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {  
        setLoading(false);
      });
  }, [isLogged, isAdmin]);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
