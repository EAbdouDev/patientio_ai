import { FC, ReactNode } from "react";
import { AuthProvider } from "@components/auth/auth-provider";
import Navbar from "@components/navigation/Navbar";

interface layoutProps {
  children: ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default layout;
