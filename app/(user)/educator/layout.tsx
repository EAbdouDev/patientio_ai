import { auth } from "@firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

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

  let userIfo = null;
  const userInfoResponse = await fetch(
    `${process.env.APP_URL}/api/users/${user?.uid}`
  );

  if (userInfoResponse.ok) {
    userIfo = await userInfoResponse.json();
  }

  const isEducator = userIfo?.isEducator;

  if (!isEducator) {
    return (
      <h1 className="text-xl mb-10">
        Error: Your account is not an educator account, please login as a
        student to continue.
      </h1>
    );
  }

  return <div>{children}</div>;
};

export default layout;
