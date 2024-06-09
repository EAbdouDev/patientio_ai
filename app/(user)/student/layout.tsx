import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("firebaseIdToken")?.value;

  if (!authToken) {
    return redirect("/");
  }
  return <div>{children}</div>;
};

export default layout;
