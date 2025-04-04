import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

export default function ContentUploadForm({ onSubmit }) {
  const { address } = useAccount();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('image');
  const [price, setPrice] = useState('0.01');
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState('100');
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ageVerification, setAgeVerification] = useState(false);
  const [contentOwnership, setContentOwnership] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Check file type
    const validTypes = {
      'image': ['image/jpeg', 'image/png', 'image/gif'],
      'video': ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      'audio': ['audio/mpeg', 'audio/wav', 'audio/ogg']
    };
    
    if (!validTypes[contentType].includes(selectedFile.type)) {
      setError(`Invalid file type. Please select a valid ${contentType} file.`);
      return;
    }
    
    // Check file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File too large. Maximum size is 100MB.');
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
    
    setError('');
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    
    if (!file) {
      setError('Please upload a file.');
      return;
    }
    
    if (!ageVerification || !contentOwnership) {
      setError('You must confirm age verification and content ownership.');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Prepare metadata
      const metadata = {
        title,
        description,
        contentType,
        price,
        isSubscription,
        subscriptionPrice: isSubscription ? subscriptionPrice : '0',
        coinName: coinName || `${title} Fan Token`,
        coinSymbol: coinSymbol || title.substring(0, 5).toUpperCase(),
        tags,
        creator: address,
        file
      };
      
      // Call the onSubmit function passed as prop
      await onSubmit(metadata);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPrice('0.01');
      setIsSubscription(false);
      setSubscriptionPrice('100');
      setCoinName('');
      setCoinSymbol('');
      setFile(null);
      setPreviewUrl('');
      setTags([]);
      setNewTag('');
      setAgeVerification(false);
      setContentOwnership(false);
      
    } catch (err) {
      console.error("Error submitting content:", err);
      setError(err.message || 'Failed to upload content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Upload New Content</h2>
      
      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-700 p-3 rounded"
                placeholder="Enter a catchy title for your content"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-700 p-3 rounded h-32"
                placeholder="Describe your content..."
              ></textarea>
            </div>
            
            <div>
              <label className="block mb-1">Content Type *</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio"
                    checked={contentType === 'image'}
                    onChange={() => setContentType('image')}
                    className="mr-2"
                  />
                  Image
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio"
                    checked={contentType === 'video'}
                    onChange={() => setContentType('video')}
                    className="mr-2"
                  />
                  Video
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio"
                    checked={contentType === 'audio'}
                    onChange={() => setContentType('audio')}
                    className="mr-2"
                  />
                  Audio
                </label>
              </div>
            </div>
            
            <div>
              <label className="block mb-1">Content File *</label>
              <input 
                type="file"
                onChange={handleFileChange}
                className="w-full bg-gray-700 p-3 rounded"
                accept={
                  contentType === 'image' ? 'image/*' : 
                  contentType === 'video' ? 'video/*' : 
                  'audio/*'
                }
              />
              <p className="text-sm text-gray-400 mt-1">
                Max file size: 100MB. Supported formats: 
                {contentType === 'image' && ' JPG, PNG, GIF'}
                {contentType === 'video' && ' MP4, MOV, AVI'}
                {contentType === 'audio' && ' MP3, WAV, OGG'}
              </p>
            </div>
            
            <div>
              <label className="block mb-1">Tags</label>
              <div className="flex">
                <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 bg-gray-700 p-3 rounded-l"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button 
                  type="button"
                  onClick={handleAddTag}
                  className="bg-pink-600 hover:bg-pink-700 px-4 rounded-r"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-700 px-3 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1">One-time Purchase Price (ETH) *</label>
              <input 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                step="0.001"
                min="0"
                className="w-full bg-gray-700 p-3 rounded"
                placeholder="0.01"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Recommended: 0.01-0.1 ETH
              </p>
            </div>
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox"
                id="subscription"
                checked={isSubscription}
                onChange={(e) => setIsSubscription(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="subscription">Enable subscription model (using creator coins)</label>
            </div>
            
            {isSubscription && (
              <div>
                <label className="block mb-1">Subscription Price (in your creator coins)</label>
                <input 
                  type="number"
                  value={subscriptionPrice}
                  onChange={(e) => setSubscriptionPrice(e.target.value)}
                  step="1"
                  min="0"
                  className="w-full bg-gray-700 p-3 rounded"
                  placeholder="100"
                />
              </div>
            )}
            
            <div>
              <label className="block mb-1">Creator Coin Name (optional)</label>
              <input 
                type="text"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                className="w-full bg-gray-700 p-3 rounded"
                placeholder="Leave blank to use default"
              />
              <p className="text-sm text-gray-400 mt-1">
                If you've already created content, your existing coin will be used
              </p>
            </div>
            
            <div>
              <label className="block mb-1">Coin Symbol (optional)</label>
              <input 
                type="text"
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
                className="w-full bg-gray-700 p-3 rounded"
                placeholder="e.g. SEXY"
                maxLength={5}
              />
            </div>
            
            {previewUrl && (
              <div>
                <label className="block mb-1">Preview</label>
                <div className="mt-2 bg-gray-900 rounded-lg p-2 flex justify-center">
                  {contentType === 'image' && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-64 rounded"
                    />
                  )}
                  {contentType === 'video' && (
                    <video 
                      src={previewUrl} 
                      controls 
                      className="max-h-64 rounded"
                    />
                  )}
                  {contentType === 'audio' && (
                    <audio 
                      src={previewUrl} 
                      controls 
                      className="w-full"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold mb-4">Verification & Consent</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <input 
                type="checkbox"
                id="ageVerification"
                checked={ageVerification}
                onChange={(e) => setAgeVerification(e.target.checked)}
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="ageVerification" className="text-sm">
                I confirm that I am at least 18 years old and that all individuals depicted in this content are over 18 years old and have provided explicit consent for its use.
              </label>
            </div>
            
            <div className="flex items-start">
              <input 
                type="checkbox"
                id="contentOwnership"
                checked={contentOwnership}
                onChange={(e) => setContentOwnership(e.target.checked)}
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="contentOwnership" className="text-sm">
                I confirm that I own all rights to this content or have explicit permission to distribute it, and that it does not violate any laws or platform policies.
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isLoading}
            className={`bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Uploading...' : 'Upload Content'}
          </button>
        </div>
      </form>
    </div>
  );
}
