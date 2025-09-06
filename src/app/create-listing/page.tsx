"use client";
import { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

export default function CreateListingPage() {
  const { contract, userCompany, role, account, fetchAllData, setMessage } = useWeb3();
  const router = useRouter();

  const [listingName, setListingName] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingQuantity, setListingQuantity] = useState("");

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contract || !listingName || !listingPrice || !listingQuantity || !userCompany) return;
    
    setMessage("Creating your listing...");
    try {
      const priceInWei = ethers.parseEther(listingPrice);
      const tx = await contract.createListing(listingName, userCompany, priceInWei, listingQuantity);
      await tx.wait();
      setMessage("Listing created successfully!");
      fetchAllData();
      router.push("/marketplace");
    } catch (error) {
      console.error(error);
      setMessage("Listing creation failed.");
    }
  };
  
  if (!account) {
    return <div className="text-center text-gray-400">Please connect your wallet to create a listing.</div>
  }

  if (role !== "seller") {
    return (
      <div className="text-center text-gray-400">
        Only users with the 'Seller' role can create listings. Please re-connect with the correct role if this is a mistake.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Create a New Listing</h1>
        <form onSubmit={handleCreateListing} className="space-y-6">
          <div>
            <label htmlFor="listingName" className="block text-sm font-medium text-gray-300 mb-2">Listing Name</label>
            <input type="text" id="listingName" value={listingName} onChange={(e) => setListingName(e.target.value)} placeholder="e.g., 10 Tons of Cotton Scraps" required className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label htmlFor="listingPrice" className="block text-sm font-medium text-gray-300 mb-2">Price per Unit (in ETH)</label>
            <input type="text" id="listingPrice" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} placeholder="e.g., 0.5" required className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label htmlFor="listingQuantity" className="block text-sm font-medium text-gray-300 mb-2">Total Quantity Available</label>
            <input type="number" min="1" id="listingQuantity" value={listingQuantity} onChange={(e) => setListingQuantity(e.target.value)} placeholder="e.g., 100" required className="w-full bg-gray-700 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Create Listing
          </Button>
        </form>
      </Card>
    </div>
  );
}