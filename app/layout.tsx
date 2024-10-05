import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoKids",
  description: "Go KIDS APP",
};

export default function RootLayout({
  children,
  hideHeader = false, // Adding a prop to conditionally hide the header
}: {
  children: React.ReactNode;
  hideHeader?: boolean; // Optional prop
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative">
          {/* Main content area */}
          <main className="pb-24">{children}</main>

          {/* Navigation */}
          <Navigation />
        </div>

        {/* You can add any global modals or overlays here */}
      </body>
    </html>
  );
}
