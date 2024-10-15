import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientNavigation from "./components/ClientNavigation";
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoKids",
  description: "Go KIDS APP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-gray-100`}>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg relative">
          {/* Main content area */}
          <main className="pb-24">{children}</main>
          
          {/* Navigation */}
          <ClientNavigation />
        </div>
        
        {/* You can add any global modals or overlays here */}
      </body>
    </html>
  );
}