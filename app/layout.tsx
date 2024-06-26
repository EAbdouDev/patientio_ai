import NextThemeProvider from "@components/NextThemeProvider";
import NextUIProvider from "@components/NextUIProvider";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Navbar from "@components/navigation/Navbar";
import { AuthProvider } from "@components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Patientio AI",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className} suppressHydrationWarning>
        <AuthProvider>
          <NextTopLoader
            color="#005efb"
            initialPosition={0.08}
            crawlSpeed={200}
            showSpinner={false}
            height={3}
            crawl={true}
            easing="ease-in-out"
            speed={200}
            shadow="0 0 10px #ffff,0 0 5px #ffffD"
            zIndex={1600}
          />

          <NextThemeProvider>
            <NextUIProvider>
              <Navbar />
              {children}
            </NextUIProvider>
          </NextThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
