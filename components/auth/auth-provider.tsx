"use client";

import { auth } from "@firebase/client";
import { GoogleAuthProvider, User, signInWithPopup } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function getAuthToken(): string | undefined {
  return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): string | undefined {
  return Cookies.set("firebaseIdToken", token, { secure: true });
}

export function removeAuthToken(): void {
  return Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
  currentUser: User | null;
  isEducator: boolean;
  isAdmin: boolean;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEducator, setIsEducator] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;

    return auth.onAuthStateChanged(async (user) => {
      if (!user) {
        removeAuthToken();
        setCurrentUser(null);
        setIsAdmin(false);
        setIsEducator(false);
      }
      if (user) {
        const token = await user.getIdToken();

        setCurrentUser(user);
        setAuthToken(token);

        const tokenValues = await user.getIdTokenResult();
        setIsAdmin(tokenValues.claims.role === "admin");

        const userResponse = await fetch(`/api/users/${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userJson = await userResponse.json();
          if (userJson?.isEducator) {
            setIsEducator(true);
          }
          if (userJson?.isAdmin) {
            setIsAdmin(true);
          }
        } else {
          console.log("Can't get user data");
        }
      }
    });
  }, []);

  function loginGoogle(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }
      signInWithPopup(auth, new GoogleAuthProvider())
        .then((user) => {
          resolve();
        })
        .catch(() => {
          console.log("error in auth-provider");
          reject();
        });
    });
  }

  function logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject();
        return;
      }
      auth
        .signOut()
        .then(() => {
          router.push("/");
          resolve();
        })
        .catch(() => {
          console.log("error in auth-provider logout");
          reject();
        });
    });
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isEducator,
        loginGoogle,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
