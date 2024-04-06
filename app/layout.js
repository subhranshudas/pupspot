import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PupSpot",
  description: "Next 13 + Contentful",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Link
          href="/success"
          className="px-12 py-4 bg-blue-800 text-white fixed top-2 right-2"
        >
          Go to Success
        </Link>

        {children}
      </body>
      <GoogleAnalytics gaId="AW-16522584580" />
    </html>
  );
}
