"use client";
import { ethers } from "ethers";
import { OrderType, Role } from "../contexts/Web3Provider";
import { useWeb3 } from "../hooks/useWeb3";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface OrderCardProps {
  order: OrderType;
  onAgentConfirm: () => void;
  onBuyerConfirm: () => void;
  onRefund: () => void;
}

const getOrderStatusInfo = (status: number): { text: string; color: string } => {
    switch (status) {
        case 0: return { text: "Awaiting Delivery", color: "bg-yellow-500/20 text-yellow-300" };
        case 1: return { text: "Complete", color: "bg-green-500/20 text-green-300" };
        case 2: return { text: "Refunded", color: "bg-red-500/20 text-red-300" };
        default: return { text: "Unknown", color: "bg-gray-500/20 text-gray-300" };
    }
};

export default function OrderCard({ order, onAgentConfirm, onBuyerConfirm, onRefund }: OrderCardProps) {
  const { role, account } = useWeb3();
  const { text, color } = getOrderStatusInfo(order.status);

  const isAgent = account && account.toLowerCase() === order.deliveryAgent.toLowerCase();
  const isBuyer = account && account.toLowerCase() === order.buyer.toLowerCase();
  
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white">Order #{order.id.toString()}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>
        </div>
        <p className="text-md text-gray-300 truncate">{order.quantity.toString()} x {order.listingName}</p>
        <p className="text-teal-400 font-semibold text-xl my-2">{ethers.formatEther(order.totalAmount)} ETH</p>
        
        <div className="text-xs space-y-1 my-3 p-3 bg-gray-900/50 rounded-md">
          <p className={order.buyerConfirmed ? 'text-green-400' : 'text-gray-400'}>
            {order.buyerConfirmed ? '✓' : '✗'} Buyer Confirmed
          </p>
          <p className={order.agentConfirmed ? 'text-green-400' : 'text-gray-400'}>
            {order.agentConfirmed ? '✓' : '✗'} Agent Confirmed
          </p>
        </div>

        <div className="text-xs text-gray-400 space-y-1 mt-2 border-t border-gray-700 pt-2">
          <p>Buyer: {order.buyer.substring(0, 6)}... ({order.buyerName})</p>
          <p>Agent: {order.deliveryAgent.substring(0, 6)}...</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {(role === 'buyer' || role === 'admin') && isBuyer && !order.buyerConfirmed && order.status === 0 &&
          <Button onClick={onBuyerConfirm} variant="secondary" className="w-full">Confirm Delivery</Button>
        }
        {(role === 'agent' || role === 'admin') && isAgent && order.status === 0 && (
          <>
            {!order.agentConfirmed && 
              <Button onClick={onAgentConfirm} className="w-full">Confirm as Agent</Button>
            }
            <Button onClick={onRefund} variant="danger" className="w-full">Refund Buyer</Button>
          </>
        )}
      </div>
    </Card>
  );
}