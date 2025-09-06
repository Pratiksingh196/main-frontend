"use client";
import { useEffect, useState } from "react";
import { useWeb3 } from "../../hooks/useWeb3";

export default function Notification() {
    const { message, setMessage } = useWeb3();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(() => setMessage(""), 300); // Clear message after fade out
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <div 
            className={`fixed bottom-5 right-5 bg-gray-700 border border-teal-500 text-white px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            {message}
        </div>
    );
}