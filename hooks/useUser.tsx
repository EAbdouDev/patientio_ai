"use client";
import { useState, useEffect } from "react";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const useUser = () => {
  const { getUser } = useKindeAuth();
  const [user, setUser] = useState<KindeUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = getUser();
      setUser(userData);
    };

    fetchUser();
  }, [getUser]);

  return user;
};

export default useUser;
