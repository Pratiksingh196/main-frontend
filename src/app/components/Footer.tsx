export default function Footer() {
    return (
      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CircularChain. All rights reserved.</p>
          <p>A Decentralized Marketplace for a Sustainable Future.</p>
        </div>
      </footer>
    );
}