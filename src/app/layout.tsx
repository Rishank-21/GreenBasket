import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Provider from "../Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";



export const metadata: Metadata = {
  title: "GreenBasket | 100% Organic Products",
  description:
    "10 minutes to your door - Fresh, organic groceries delivered fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="w-full min-h-screen bg-linear-to-b from-green-100 to-white"
        suppressHydrationWarning
      >
        <Provider><StoreProvider><InitUser />{children}</StoreProvider></Provider>
      </body>
    </html>
  );
}
