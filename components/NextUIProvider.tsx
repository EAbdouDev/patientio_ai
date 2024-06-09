"use client";
import * as React from "react";

// 1. import `NextUIProvider` component
import { NextUIProvider as NextUI } from "@nextui-org/react";

import { FC } from "react";

interface NextUIProviderProps {
  children: React.ReactNode;
}

const NextUIProvider: FC<NextUIProviderProps> = ({ children }) => {
  return <NextUI>{children}</NextUI>;
};

export default NextUIProvider;
