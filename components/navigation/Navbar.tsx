"use client";
import { useAuth } from "@components/auth/auth-provider";
import { FC } from "react";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  const auth = useAuth();

  const loginGoogle = () => {
    auth
      ?.loginGoogle()
      .then(() => console.log("logged in"))
      .catch(() => console.log("error (in nav loginGoogle)"));
  };
  const loginout = () => {
    auth
      ?.logout()
      .then(() => console.log("logged out"))
      .catch(() => console.log("error (in nav loginout)"));
  };
  return (
    <div className="flex justify-start items-start gap-6">
      {!auth?.currentUser && <button onClick={loginGoogle}>sign-in</button>}
      {auth?.currentUser && <button onClick={loginout}>sign-out</button>}

      {auth?.currentUser && (
        <div>
          <p>{auth.currentUser.displayName}</p> <p>{auth.currentUser.email}</p>
        </div>
      )}

      {auth?.currentUser && auth?.isAdmin && (
        <span className="bg-red-500 p-2 rounded-lg">Admin Account</span>
      )}

      {auth?.currentUser && !auth?.isAdmin && (
        <span className="bg-blue-500 p-2 rounded-lg">
          User Acoount (student or educator)
        </span>
      )}
    </div>
  );
};

export default Navbar;
