import type { Metadata } from "next";
import { Roboto } from "next/font/google";
// @ts-ignore: CSS side-effect import without type declarations
import "./globals.css";
// @ts-ignore: CSS side-effect import without type declarations
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "@/src/components/providers";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PHC",
  description: "PHC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
