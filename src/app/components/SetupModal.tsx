import { useState } from "react";
import { Role } from "../contexts/Web3Provider";
import { Button } from "./ui/Button";

interface SetupModalProps {
  onSave: (name: string, company: string, role: Role) => void;
}

export default function SetupModal({ onSave }: SetupModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;
    if (selectedRole === 'admin') {
      onSave('', '', 'admin');
    } else if (name && company) {
      onSave(name, company, selectedRole);
    }
  };

  const isSubmitDisabled = !selectedRole || (selectedRole !== 'admin' && (!name || !company));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-2 text-teal-400">One-Time Setup</h2>
          <p className="text-gray-400 mb-6">Select your role and enter your details for this session.</p>
          <div className="mb-4">
            <p className="text-gray-300 font-medium mb-2">1. Select your primary role:</p>
            <div className="grid grid-cols-2 gap-2">
              {(["buyer", "seller", "agent", "admin"] as Role[]).map(r => (
                <button type="button" key={r} onClick={() => setSelectedRole(r)} className={`p-3 rounded-md font-semibold text-sm transition-colors ${selectedRole === r ? 'bg-teal-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {selectedRole && selectedRole !== 'admin' && (
            <div className="space-y-4">
              <p className="text-gray-300 font-medium mb-2">2. Enter your details:</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" required className="w-full bg-gray-700 p-3 rounded-md border border-gray-600" />
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Company Name" required className="w-full bg-gray-700 p-3 rounded-md border border-gray-600" />
            </div>
          )}
          {selectedRole === 'admin' && (
            <div className="p-3 text-center bg-gray-700 rounded-md text-sm text-gray-300">Admin role does not require personal details.</div>
          )}
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isSubmitDisabled}>Save and Enter</Button>
          </div>
        </form>
      </div>
    </div>
  );
}