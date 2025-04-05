import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { mintContent } from '../services/contentService';

export default function ContentCard({ content, purchased = false }) {
  const { address, isConnected } = useAccount();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      
      // Call mintContent service
      const result = await mintContent(content.id, content.price);
      
      setPurchaseSuccess(true);
      setShowModal(true);
      
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
  if (content.contentType === 'image') {
    return (
      <img 
        src={content.previewUrl || '/images/content/photo-content.png'} 
        alt={content.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
    );
  } else if (content.contentType === 'video') {
    return (
      <div className="relative w-full h-48">
        <img 
          src={content.previewUrl || '/images/content/video-content.png'} 
          alt={content.title}
          className="w-full h-full object-cover rounded-t-lg"
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
  } else if (content.contentType === 'audio') {
    return (
      <div className="relative w-full h-48">
        <img 
          src={content.previewUrl || '/images/content/audio-content.png'} 
          alt={content.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      </div>
    );
  }
    return null;
    }; 

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-102">
      {/* Content Preview */}
      <div className="relative">
        {getContentPreview()}
        <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
          {content.contentType.toUpperCase()}
        </div>
        
        {content.isSubscription && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
            SUBSCRIPTION
          </div>
        )}
      </div>
      
      {/* Content Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{content.title}</h3>
        
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img 
              src={content.creator?.profileImage || '/placeholder-avatar.jpg'} 
              alt={content.creator?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-gray-300">{content.creator?.name}</span>
          
          {content.coinSymbol && (
            <div className="ml-auto flex items-center bg-gray-700 px-2 py-1 rounded">
              <span className="text-sm text-yellow-400 mr-1">$</span>
              <span className="text-sm">{content.coinSymbol}</span>
            </div>
          )}
        </div>
        
        {content.description && (
          <p className="text-gray-400 mb-3 text-sm line-clamp-2">{content.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-400">
            {content.createdAt && `Created ${formatDate(content.createdAt)}`}
          </div>
          <div className="text-sm text-gray-400">
            {content.mintCount !== undefined && `${content.mintCount} mints`}
          </div>
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-400">Price</p>
            <p className="text-xl font-bold">{content.price} ETH</p>
          </div>
          
          {content.isSubscription && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Subscription</p>
              <p className="text-lg font-semibold">{content.subscriptionPrice} ${content.coinSymbol}</p>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        {purchased ? (
          <button 
            className="w-full bg-gray-600 text-white font-bold py-2 rounded-lg flex justify-center items-center"
            onClick={() => setShowModal(true)}
          >
            View Content
          </button>
        ) : (
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
        )}
        
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>
      
      {/* Purchase/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-lg w-full p-6">
            {purchased ? (
              <>
                <h3 className="text-2xl font-bold mb-4">{content.title}</h3>
                <div className="mb-4">
                  {content.contentType === 'image' && (
                    <img 
                      src={content.contentUrl || content.previewUrl || '/images/content/photo-content.png'} 
                      alt={content.title}
                      className="w-full rounded"
                    />
                  )}
                  {content.contentType === 'video' && (
                    <video 
                      src={content.contentUrl} 
                      controls
                      className="w-full rounded"
                      autoPlay
                    ></video>
                  )}
                  {content.contentType === 'audio' && (
                    <audio 
                      src={content.contentUrl} 
                      controls
                      className="w-full"
                      autoPlay
                    ></audio>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-gray-300">{content.description}</p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4">Purchase Confirmation</h3>
                <p className="mb-4">You are about to purchase:</p>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded overflow-hidden mr-4">
                    <img 
                      src={content.previewUrl || '/images/content/photo-content.png'} 
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{content.title}</p>
                    <p className="text-gray-400">by {content.creator?.name}</p>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Price:</span>
                    <span className="font-bold">{content.price} ETH</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Platform Fee:</span>
                    <span>{(parseFloat(content.price) * 0.03).toFixed(4)} ETH</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{content.price} ETH</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  By purchasing this content, you agree to our Terms of Service and confirm that you are at least 18 years old.
                </p>
              </>
            )}
            <div className="flex justify-end">
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                {purchased ? 'Close' : 'Cancel'}
              </button>
              {!purchased && (
                <button
                  className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handlePurchase}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm Purchase'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
