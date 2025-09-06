"use client";
import { useWeb3 } from "../hooks/useWeb3";
import { ListingType } from "../contexts/Web3Provider";
import ListingCard from "../components/ListingCard";
import CreateOrderModal from "../components/CreateOrderModal";
import SetupModal from "../components/SetupModal";
import { useState } from "react";
import { ethers } from "ethers";

export default function MarketplacePage() {
  const { listings, isLoading, account, role, userName, userCompany, contract, setMessage, fetchAllData, saveSession } = useWeb3();
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(!role && !!account);
  const [currentListing, setCurrentListing] = useState<ListingType | null>(null);
  
  const [quantityToBuy, setQuantityToBuy] = useState("1");
  const [deliveryAgent, setDeliveryAgent] = useState("");

  const openOrderModal = (listing: ListingType) => {
    setCurrentListing(listing);
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setCurrentListing(null);
    setQuantityToBuy("1");
    setDeliveryAgent("");
  };

  const handleCreateOrder = async () => {
    if (!contract || !currentListing || !quantityToBuy || !deliveryAgent) return;
    if (role !== 'admin' && (!userName || !userCompany)) return;
    
    setMessage("Processing your order...");
    try {
      const quantity = BigInt(quantityToBuy);
      const totalPrice = currentListing.pricePerUnit * quantity;
      const buyerNameToUse = role === 'admin' ? 'Admin' : userName;
      const buyerCompanyToUse = role === 'admin' ? 'Admin' : userCompany;
      
      const tx = await contract.createOrder(
        currentListing.id, quantity, deliveryAgent, buyerNameToUse, buyerCompanyToUse, { value: totalPrice }
      );
      await tx.wait();
      setMessage("Order created successfully!");
      fetchAllData();
      closeOrderModal();
    } catch (error) {
      console.error(error);
      setMessage("Order creation failed. Check console for details.");
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading marketplace listings...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
        Marketplace
      </h1>
      
      {listings.length === 0 ? (
        <p className="text-center text-gray-400">No active listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map(listing => (
            <ListingCard
              key={listing.id.toString()}
              listing={listing}
              onOrder={() => openOrderModal(listing)}
            />
          ))}
        </div>
      )}

      {isOrderModalOpen && currentListing && (
        <CreateOrderModal
          listing={currentListing}
          quantity={quantityToBuy}
          setQuantity={setQuantityToBuy}
          deliveryAgent={deliveryAgent}
          setDeliveryAgent={setDeliveryAgent}
          onClose={closeOrderModal}
          onCreateOrder={handleCreateOrder}
        />
      )}
      
      {isSetupModalOpen && (
        <SetupModal onSave={(name, company, role) => {
            saveSession({ name, company, role });
            setIsSetupModalOpen(false);
        }} />
      )}
    </div>
  );
}