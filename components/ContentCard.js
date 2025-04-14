import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function ContentCard({ content }) {
  const { address, isConnected } = useAccount();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Make sure content and creator have required properties with fallbacks
  const safeContent = {
    id: content?.id || `content-${Math.random().toString(36).substr(2, 9)}`,
    title: content?.title || "Untitled Content",
    description: content?.description || "",
    contentType: content?.contentType || "image",
    price: content?.price || "0.01",
    isSubscription: content?.isSubscription || false,
    subscriptionPrice: content?.subscriptionPrice || "0",
    mintCount: content?.mintCount || 0,
    previewUrl: content?.previewUrl || "/placeholder-image.jpg",
    createdAt: content?.createdAt || new Date().toISOString()
  };
  
  // Ensure creator object has the expected structure
  const safeCreator = {
    address: content?.creator?.address || "0x0000000000000000000000000000000000000000",
    name: content?.creator?.name || "Unknown Creator",
    profileImage: content?.creator?.profileImage || "/placeholder-avatar.jpg"
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Unknown Date";
    }
  };
  
  // Handle content purchase
  const handlePurchase = async () => {
    if (!isConnected) {
      setError('Please connect your wallet to purchase content.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Simulate transaction processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPurchaseSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error purchasing content:", err);
      setError(err.message || 'Failed to purchase content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getContentPreview = () => {
    if (safeContent.contentType === 'image') {
      return (
        <img 
          src={safeContent.previewUrl || '/placeholder-image.jpg'} 
          alt={safeContent.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      );
    } else if (safeContent.contentType === 'video') {
      return (
        <div className="relative w-full h-48">
          <img 
            src={safeContent.previewUrl || '/placeholder-image.jpg'} 
            alt={safeContent.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      );
    } else if (safeContent.contentType === 'audio') {
      return (
        <div className="relative w-full h-48">
          <img 
            src={safeContent.previewUrl || '/placeholder-image.jpg'} 
            alt={safeContent.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
        <span className="text-gray-400">No Preview</span>
      </div>
    );
  }; 

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-102">
      {/* Content Preview */}
      <div className="relative">
        {getContentPreview()}
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
          {safeContent.contentType?.toUpperCase() || "CONTENT"}
        </div>
        
        {safeContent.isSubscription && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
            SUBSCRIPTION
          </div>
        )}
      </div>
      
      {/* Content Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{safeContent.title}</h3>
        
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-700">
            <img 
              src={safeCreator.profileImage}
              alt={safeCreator.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-avatar.jpg';
              }}
            />
          </div>
          <span className="text-gray-300">{safeCreator.name}</span>
          
          {content?.coinSymbol && (
            <div className="ml-auto flex items-center bg-gray-700 px-2 py-1 rounded">
              <span className="text-sm text-yellow-400 mr-1">$</span>
              <span className="text-sm">{content.coinSymbol}</span>
            </div>
          )}
        </div>
        
        {safeContent.description && (
          <p className="text-gray-400 mb-3 text-sm line-clamp-2">{safeContent.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-400">
            {safeContent.createdAt && `Created ${formatDate(safeContent.createdAt)}`}
          </div>
          <div className="text-sm text-gray-400">
            {safeContent.mintCount !== undefined && `${safeContent.mintCount} mints`}
          </div>
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-xl font-bold">{safeContent.price} ETH</p>
          </div>
          
          {safeContent.isSubscription && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Subscription</p>
              <p className="text-lg font-semibold">{safeContent.subscriptionPrice} ${content?.coinSymbol || 'COIN'}</p>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <button 
          className={`w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              {purchaseSuccess ? 'Purchased!' : 'Purchase'}
            </>
          )}
        </button>
        
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
