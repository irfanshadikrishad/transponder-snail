import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/user";

const poppins = Poppins({
  subsets: ["latin"],
  display: "auto",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Transponder Snail",
  description:
    "Chat with your friends and family without worrying about privacy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
