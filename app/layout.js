import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { draftMode } from "next/headers";
import { PreviewExit } from "./preview-exit";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PupSpot",
  description: "Next 13 + Contentful",
};

export default function RootLayout({ children }) {
  const { isEnabled } = draftMode();

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

        {isEnabled ? (
          <p className="w-full z-[9999] bg-orange-200 py-4 text-center">
            Preview mode is on!
            <PreviewExit />
          </p>
        ) : null}
      </body>
      <GoogleAnalytics gaId="AW-16522584580" />
    </html>
  );
}
