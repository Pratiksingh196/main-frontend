"use client";
import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ethers, Contract, BrowserProvider, Eip1193Provider } from "ethers";

// --- IMPORTANT ---
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // <-- PASTE NEW ADDRESS HERE
import contractABI from "../../abi/Market.json";

// --- Type Definitions ---
export type ListingType = {
  id: bigint; name: string; companyName: string; pricePerUnit: bigint;
  quantityAvailable: bigint; seller: string; isActive: boolean;
};
export type OrderType = {
  id: bigint; listingId: bigint; quantity: bigint; totalAmount: bigint; buyer: string;
  buyerName: string; buyerCompany: string; deliveryAgent: string;
  agentConfirmed: boolean; buyerConfirmed: boolean;
  status: number;
  listingName?: string; // Will be added in the frontend
  seller?: string;      // Will be added in the frontend
};
export type Role = "seller" | "buyer" | "agent" | "admin";
type SessionData = { name?: string; company?: string; role: Role; };

interface IWeb3Context {
  account: string | null;
  contract: Contract | null;
  role: Role | null;
  userName: string;
  userCompany: string;
  listings: ListingType[];
  orders: OrderType[];
  message: string;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  saveSession: (data: SessionData) => void;
  fetchAllData: () => Promise<void>;
  setMessage: (msg: string) => void;
}

export const Web3Context = createContext<IWeb3Context | null>(null);

declare global {
  interface Window { ethereum?: Eip1193Provider; }
}

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // User Profile State
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userCompany, setUserCompany] = useState<string>("");

  // App Data State
  const [listings, setListings] = useState<ListingType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const getSession = (): SessionData | null => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem(`session_${account}`);
    return data ? JSON.parse(data) : null;
  };

  const saveSession = (data: SessionData) => {
    if (typeof window === "undefined" || !account) return;
    sessionStorage.setItem(`session_${account}`, JSON.stringify(data));
    setRole(data.role);
    setUserName(data.name || "");
    setUserCompany(data.company || "");
  };

  const initialize = useCallback(async (currentAccount: string) => {
    if (!window.ethereum) return;
    setAccount(currentAccount);
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const marketplaceContract = new Contract(contractAddress, contractABI, signer);
    setContract(marketplaceContract);

    const session = getSession();
    if (session) {
      setRole(session.role);
      setUserName(session.name || "");
      setUserCompany(session.company || "");
    }
  }, [account]); // Add account to dependency array

  const connectWallet = async () => {
    try {
      if (!window.ethereum) { setMessage("Please install MetaMask."); return; }
      const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        await initialize(accounts[0]);
      }
    } catch (error) {
      console.error("Error connecting:", error);
      setMessage("Failed to connect wallet.");
    }
  };

  const fetchAllData = useCallback(async () => {
    if (!contract || !account) return;
    setIsLoading(true);
    setMessage("Fetching latest data...");
    try {
      const nextListingId = await contract.nextListingId();
      const listingPromises = Array.from({ length: Number(nextListingId) - 1 }, (_, i) => contract.listings(i + 1));
      const allListingsData = await Promise.all(listingPromises);
      
      const listingsMap = new Map<number, ListingType>();
      allListingsData.forEach(l => { if (l && l.id > 0) listingsMap.set(Number(l.id), l); });

      const activeListings = allListingsData.filter(l => l && l.isActive && l.id > 0);
      setListings(activeListings.slice().reverse());

      const nextOrderId = await contract.nextOrderId();
      const orderPromises = Array.from({ length: Number(nextOrderId) - 1 }, (_, i) => contract.orders(i + 1));
      const allOrdersRaw = await Promise.all(orderPromises);
      
      const userAddress = account.toLowerCase();
      const userOrders = allOrdersRaw
        .filter(order => order && order.id > 0)
        .map(order => {
            const listing = listingsMap.get(Number(order.listingId));
            return {
                ...order,
                status: Number(order.status),
                listingName: listing?.name || "Unknown Listing",
                seller: listing?.seller || ethers.ZeroAddress
            };
        })
        .filter(order => {
            return (
                order.buyer.toLowerCase() === userAddress ||
                order.seller.toLowerCase() === userAddress ||
                order.deliveryAgent.toLowerCase() === userAddress
            );
        });

      setOrders(userOrders.slice().reverse());

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMessage("Could not fetch data from the contract.");
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  }, [contract, account]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        initialize(accounts[0]);
      } else {
        setAccount(null);
        setContract(null);
        setRole(null);
      }
    };

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged as any);
    }
    
    // Initial connection check
    if(window.ethereum?.selectedAddress) {
        initialize(window.ethereum.selectedAddress);
    }

    return () => {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged as any);
        }
    };
  }, [initialize]);
  
  useEffect(() => {
      if (contract && account) {
          fetchAllData();
          const onAnyEvent = () => fetchAllData();
          const events = ["ListingCreated", "OrderCreated", "AgentConfirmed", "BuyerConfirmed", "DeliveryCompleted", "OrderRefunded"];
          events.forEach(event => contract.on(event, onAnyEvent));

          return () => {
              events.forEach(event => contract.off(event, onAnyEvent));
          };
      }
  }, [contract, account, fetchAllData]);

  return (
    <Web3Context.Provider value={{
      account, contract, role, userName, userCompany, listings, orders, message, isLoading,
      connectWallet, saveSession, fetchAllData, setMessage
    }}>
      {children}
    </Web3Context.Provider>
  );
};