"use client";
import Link from "next/link";
import { useWeb3 } from "./hooks/useWeb3";
import { Button } from "./components/ui/Button";

export default function HomePage() {
  const { account, connectWallet } = useWeb3();

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh]">
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
          Welcome to CircularChain
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          The liquid marketplace for industrial byproducts. Turn waste into value, powered by a secure and transparent escrow system on the blockchain.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {!account ? (
          <Button onClick={connectWallet} size="lg">
            Connect Wallet to Start
          </Button>
        ) : (
          <Link href="/marketplace">
            <Button size="lg" variant="primary">
              Explore Marketplace
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}