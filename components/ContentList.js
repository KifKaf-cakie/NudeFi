import { useState } from 'react';
import ContentCard from './ContentCard';

export default function ContentList({ contents, isCreator = false, purchasedContent = [], title = "Content" }) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  
  // Filter contents based on type
  const filteredContents = contents.filter(content => {
    if (filterType === 'all') return true;
    return content.contentType === filterType;
  });
  
  // Sort contents based on selected option
  const sortedContents = [...filteredContents].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price-asc':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-desc':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'popular':
        return b.mintCount - a.mintCount;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });
  
  // Check if a content is purchased
  const isPurchased = (contentId) => {
    return purchasedContent.some(c => c.id === contentId);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">{title}</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          {/* Filter by type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
          
          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      {sortedContents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContents.map((content) => (
            <ContentCard 
              key={content.id} 
              content={content} 
              purchased={isPurchased(content.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-gray-400 mb-4">No content available.</p>
          {isCreator && (
            <p>
              Start by uploading your first content to build your creator portfolio.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
