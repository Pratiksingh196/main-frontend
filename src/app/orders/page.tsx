"use client";
import { useWeb3 } from "../hooks/useWeb3";
import OrderCard from "../components/OrderCard";
import { Button } from "../components/ui/Button";
import Link from "next/link";
import { Role } from "../contexts/Web3Provider";
import SetupModal from "../components/SetupModal";

export default function OrdersPage() {
  const { orders, isLoading, account, role, saveSession, contract, setMessage, fetchAllData } = useWeb3();
  
  if (!account) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
        <p className="text-gray-400">You need to connect your wallet to view your orders.</p>
      </div>
    );
  }
  
  if (!role) {
    return <SetupModal onSave={(name, company, role) => saveSession({ name, company, role })} />;
  }
  
  if (isLoading) {
    return <div className="text-center">Loading your orders...</div>;
  }

  const handleConfirm = async (orderId: bigint, confirmType: 'agent' | 'buyer') => {
      if (!contract) return;
      const action = confirmType === 'agent' ? 'agentConfirmDelivery' : 'buyerConfirmDelivery';
      const typeCapitalized = confirmType.charAt(0).toUpperCase() + confirmType.slice(1);
      setMessage(`${typeCapitalized} confirming Order #${orderId}...`);
      try {
          const tx = await contract[action](orderId);
          await tx.wait();
          setMessage(`${typeCapitalized} confirmation for Order #${orderId} was successful!`);
          fetchAllData();
      } catch (error) {
          console.error(error);
          setMessage(`${typeCapitalized} confirmation failed.`);
      }
  };

  const handleRefund = async (orderId: bigint) => {
      if (!contract) return;
      setMessage(`Refunding Order #${orderId}...`);
      try {
          const tx = await contract.refundOrder(orderId);
          await tx.wait();
          setMessage(`Order #${orderId} has been refunded.`);
          fetchAllData();
      } catch (error) {
          console.error(error);
          setMessage("Failed to process refund.");
      }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
          My Orders
        </h1>
        {role === 'seller' && (
          <Link href="/create-listing">
            <Button>Create New Listing</Button>
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-10">You are not involved in any orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <OrderCard
              key={order.id.toString()}
              order={order}
              onAgentConfirm={() => handleConfirm(order.id, 'agent')}
              onBuyerConfirm={() => handleConfirm(order.id, 'buyer')}
              onRefund={() => handleRefund(order.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}