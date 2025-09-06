import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "./contexts/Web3Provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Notification from "./components/ui/Notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CircularChain",
  description: "A decentralized marketplace for industrial byproducts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Web3Provider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <Notification />
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}