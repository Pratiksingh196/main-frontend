"use client";
import { ethers } from "ethers";
import { ListingType } from "../contexts/Web3Provider";
import { useWeb3 } from "../hooks/useWeb3";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface ListingCardProps {
  listing: ListingType;
  onOrder: () => void;
}

export default function ListingCard({ listing, onOrder }: ListingCardProps) {
    const { role, account } = useWeb3();
    const canBuy = (role === 'buyer' || role === 'admin') && listing.seller.toLowerCase() !== account?.toLowerCase();

    return(
        <Card className="flex flex-col justify-between">
            <div>
                <h3 className="font-bold text-lg truncate text-white">{listing.name}</h3>
                <p className="text-sm text-gray-400 mb-3">by {listing.companyName}</p>
                <p className="text-teal-400 font-semibold text-2xl my-2">{ethers.formatEther(listing.pricePerUnit)} ETH</p>
                <p className="text-xs text-gray-500">In Stock: {listing.quantityAvailable.toString()}</p>
            </div>
            <div className="mt-4">
                {canBuy &&
                    <Button 
                        onClick={onOrder} 
                        disabled={listing.quantityAvailable===0n} 
                        className="w-full"
                    >
                        Create Order
                    </Button>
                }
            </div>
        </Card>
    );
}