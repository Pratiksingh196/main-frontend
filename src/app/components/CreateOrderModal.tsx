import { ethers } from "ethers";
import { ListingType } from "../contexts/Web3Provider";
import { Button } from "./ui/Button";

interface CreateOrderModalProps {
  listing: ListingType;
  quantity: string;
  setQuantity: (val: string) => void;
  deliveryAgent: string;
  setDeliveryAgent: (val: string) => void;
  onClose: () => void;
  onCreateOrder: () => void;
}

export default function CreateOrderModal({ listing, quantity, setQuantity, deliveryAgent, setDeliveryAgent, onClose, onCreateOrder }: CreateOrderModalProps) {
  const maxQty = Number(listing.quantityAvailable);
  const currentQty = Number(quantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
        setQuantity("1");
    } else if (value > maxQty) {
        setQuantity(maxQty.toString());
    } else {
        setQuantity(value.toString());
    }
  };

  const totalPrice = ethers.formatEther(listing.pricePerUnit * BigInt(quantity || 0));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Create Order for {listing.name}</h2>
        <div className="space-y-4">
          <input type="number" min="1" max={maxQty} value={quantity} onChange={handleQuantityChange} placeholder="Quantity to Buy" className="w-full bg-gray-700 p-3 rounded-md border border-gray-600" />
          <input type="text" value={deliveryAgent} onChange={e => setDeliveryAgent(e.target.value)} placeholder="Delivery Agent Address" className="w-full bg-gray-700 p-3 rounded-md border border-gray-600" />
        </div>
        <div className="mt-4 p-3 bg-gray-900 rounded-md text-center">
          <p className="text-gray-400">Total Price</p>
          <p className="text-2xl font-bold text-teal-400">{totalPrice} ETH</p>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={onCreateOrder}>Confirm Purchase</Button>
        </div>
      </div>
    </div>
  );
}