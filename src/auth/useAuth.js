import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../fbconfig";

// auth context & custom hook
export const AuthContext = createContext();

// readymade provider to be called at parent level(Routes.js)
export const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      firebaseUser ? setUser(firebaseUser) : setUser(null);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ user, loadingAuth }} {...props} />;
};

// custom hook, directly get values of user & isAuthenticated i.e.(bool)
export const useAuth = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  return { user, loadingAuth, isAuthenticated: user !== null };
};
