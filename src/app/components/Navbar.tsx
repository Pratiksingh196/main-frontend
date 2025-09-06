"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "../hooks/useWeb3";
import { Button } from "./ui/Button";

export default function Navbar() {
  const { account, role, connectWallet } = useWeb3();
  const pathname = usePathname();

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/orders", label: "My Orders", requiresAuth: true },
    { href: "/create-listing", label: "Create Listing", requiresRole: "seller" },
  ];

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-teal-400">
            CircularChain
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label, requiresAuth, requiresRole }) => {
              const isActive = pathname === href;
              if (requiresAuth && !account) return null;
              if (requiresRole && role !== requiresRole) return null;
              
              return (
                <Link key={href} href={href} className={`text-sm font-medium transition-colors ${isActive ? 'text-teal-400' : 'text-gray-300 hover:text-white'}`}>
                    {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            {account ? (
              <div className="flex items-center space-x-3">
                {role && <span className="hidden sm:inline px-3 py-1 bg-gray-700 text-teal-400 text-xs font-bold rounded-full uppercase">{role}</span>}
                <p className="bg-gray-700 text-white py-2 px-4 rounded-full text-sm font-semibold">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </p>
              </div>
            ) : (
              <Button onClick={connectWallet} variant="primary">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}