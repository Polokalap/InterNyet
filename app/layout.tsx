import type {Metadata, Viewport} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterNyet",
  description: "InterNyet is an [Image Board](https://en.wikipedia.org/wiki/Imageboard) made to help people communicate, and find like-minded people. \n" +
      "While we allow people to post and comment anonymously, please read our [Rules](/rules) and [FAQ](/faq) before posting!\n" +
      "We believe power leads to corruption, and that's why we try to minimize the amount of moderators on our site. So please try to avoid creating posts that are against our rules. If you do end up liking our website, please consider [Donating](/donate), so we can keep the site running!\n" +
      "\n" +
      "When you are done reading this, you can close this pop-up, so you won't see it again. Have fun posting!"

};

export const viewport: Viewport = {
  themeColor: "#fff1e1",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
