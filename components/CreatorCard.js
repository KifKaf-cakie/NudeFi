import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { buyCoin } from '../services/zoraService';

export default function CreatorCard({ creator }) {
  const { address, isConnected } = useAccount();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseAmount, setPurchaseAmount] = useState('0.01');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Handle buying creator coin
  const handleBuyCoin = async () => {
    if (!isConnected) {
      setError('Please connect your wallet to purchase coins.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Use the Zora SDK through our service to buy the coin
      const buyParams = {
        coinAddress: creator.coinAddress,
        amount: purchaseAmount,
        recipient: address,
      };
      
      const result = await buyCoin(buyParams, address);
      console.log('Buy transaction result:', result);
      
      // Show success state
      setPurchaseSuccess(true);
      
      // Reset after delay
      setTimeout(() => {
        setShowBuyModal(false);
        setPurchaseAmount('0.01');
        setPurchaseSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error buying creator coin:", err);
      setError(err.message || 'Failed to purchase coins. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-102">
      {/* Creator Banner & Profile Image */}
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-pink-600 to-purple-600"></div>
        <div className="absolute top-12 left-4 w-20 h-20 rounded-full border-4 border-gray-800 overflow-hidden">
          <img 
            src={creator.profileImage || '/placeholder-avatar.jpg'} 
            alt={creator.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* Creator Info */}
      <div className="pt-10 p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{creator.name}</h3>
          <div className="flex items-center bg-gray-700 px-2 py-1 rounded">
            <span className="text-sm text-yellow-400 mr-1">$</span>
            <span className="text-sm">{creator.coinSymbol}</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 text-sm line-clamp-2">{creator.bio}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-xs mb-1">Market Cap</p>
            <p className="text-lg font-bold">{creator.marketCap} ETH</p>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-xs mb-1">24h Growth</p>
            <p className={`text-lg font-bold ${parseFloat(creator.growth24h) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {creator.growth24h}%
            </p>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <div>Contents: {creator.contentCount}</div>
          <div>Followers: {creator.followers}</div>
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/creator/${creator.address}`} legacyBehavior>
            <a className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-2 rounded-lg">
              View Profile
            </a>
          </Link>
          <button 
            className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg"
            onClick={() => setShowBuyModal(true)}
          >
            Buy ${creator.coinSymbol}
          </button>
        </div>
      </div>
      
      {/* Buy Coin Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            {purchaseSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Purchase Successful!</h3>
                <p className="text-gray-300 mb-6">
                  You've successfully purchased ${creator.coinSymbol} tokens.
                </p>
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => setShowBuyModal(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4">Buy ${creator.coinSymbol} Coins</h3>
                
                <div className="mb-6">
                  <p className="text-gray-300 mb-2">
                    Support <span className="font-bold">{creator.name}</span> by buying their creator coins.
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    Creator coins give you benefits like subscription access to exclusive content and voting rights in creator decisions.
                  </p>
                  
                  <div className="mb-4">
                    <label className="block mb-2">Amount to Spend (ETH)</label>
                    <div className="flex">
                      <input 
                        type="number"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                        step="0.01"
                        min="0.01"
                        className="flex-1 bg-gray-700 p-3 rounded-l"
                        placeholder="0.01"
                      />
                      <div className="bg-gray-600 px-4 py-3 rounded-r flex items-center">
                        ETH
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded mb-4">
                    <div className="flex justify-between mb-2">
                      <span>Current Price:</span>
                      <span>{creator.coinPrice} ETH per coin</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Estimated Coins:</span>
                      <span className="font-bold">
                        {purchaseAmount && creator.coinPrice ? 
                          (parseFloat(purchaseAmount) / parseFloat(creator.coinPrice)).toFixed(2) : 
                          '0'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-600 bg-opacity-25 border border-red-400 text-red-100 p-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => setShowBuyModal(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleBuyCoin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : 'Buy Coins'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
