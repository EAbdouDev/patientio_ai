import { FC, ReactNode } from "react";
import { AuthProvider } from "@components/auth/auth-provider";
import Navbar from "@components/navigation/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "@firebase/server";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken || !auth) {
    return redirect("/");
  }

  let user: DecodedIdToken | null = null;

  if (!user) {
    return redirect("/");
  }

  try {
    user = await auth.verifyIdToken(authToken);
  } catch (error) {
    console.log(error);
  }

  const isAdmin = user.role === "admin";

  if (!isAdmin) {
    return (
      <h1 className="text-xl mb-10">
        Error: Your account is not an admin account, please login as a student
        or an educator to continue.
      </h1>
    );
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default layout;
