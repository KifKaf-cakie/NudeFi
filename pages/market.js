import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/connectors';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import CreatorCard from '../components/CreatorCard';
import { getAITrendPredictions } from '../services/aiService';
import { fetchTrendingContent, fetchTrendingCreators } from '../services/contentService';

export default function MarketPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  
  const [activeView, setActiveView] = useState('content');
  const [trendingContent, setTrendingContent] = useState([]);
  const [trendingCreators, setTrendingCreators] = useState([]);
  const [trendPredictions, setTrendPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');
  const [timeframe, setTimeframe] = useState('24h');
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Load data based on active view
        if (activeView === 'content') {
          const content = await fetchTrendingContent(12);
          setTrendingContent(content);
        } else {
          const creators = await fetchTrendingCreators(12);
          setTrendingCreators(creators);
        }
        
        // Get AI trend predictions
        const predictions = await getAITrendPredictions();
        setTrendPredictions(predictions);
      } catch (error) {
        console.error("Error loading market data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [activeView]);
  
  // Sort data based on selected option
  const getSortedData = () => {
    if (activeView === 'content') {
      return [...trendingContent].sort((a, b) => {
        switch (sortBy) {
          case 'trending':
            return b.trendScore - a.trendScore;
          case 'popular':
            return b.mintCount - a.mintCount;
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'price-asc':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price-desc':
            return parseFloat(b.price) - parseFloat(a.price);
          default:
            return b.trendScore - a.trendScore;
        }
      });
    } else {
      return [...trendingCreators].sort((a, b) => {
        switch (sortBy) {
          case 'trending':
            return parseFloat(b.growth24h) - parseFloat(a.growth24h);
          case 'marketcap':
            return parseFloat(b.marketCap) - parseFloat(a.marketCap);
          case 'followers':
            return b.followers - a.followers;
          case 'content':
            return b.contentCount - a.contentCount;
          default:
            return parseFloat(b.growth24h) - parseFloat(a.growth24h);
        }
      });
    }
  };
  
  const sortedData = getSortedData();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Market - NudeFi</title>
        <meta name="description" content="NudeFi marketplace for adult content NFTs and creator coins" />
      </Head>
      
      <Header isConnected={isConnected} address={address} connect={connect} disconnect={disconnect} />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">NFT Market</h1>
          <p className="text-gray-400">Buy and trade adult content NFTs and creator coins</p>
        </div>
        
        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">24h Volume</p>
            <p className="text-2xl font-bold">12.45 ETH</p>
            <p className="text-green-500 text-sm">+5.2%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Active NFTs</p>
            <p className="text-2xl font-bold">1,257</p>
            <p className="text-green-500 text-sm">+12 today</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Creator Coins</p>
            <p className="text-2xl font-bold">89</p>
            <p className="text-green-500 text-sm">+3 today</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Avg. NFT Price</p>
            <p className="text-2xl font-bold">0.068 ETH</p>
            <p className="text-red-500 text-sm">-0.8%</p>
          </div>
        </div>
        
        {/* AI Trend Insight */}
        {trendPredictions.length > 0 && (
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              <span className="mr-2">🔮</span>
              AI Trend Insight
            </h2>
            <p className="mb-3">{trendPredictions[0].description}</p>
            <div className="flex items-center">
              <span className="text-pink-500 font-bold">{trendPredictions[0].confidence}% confidence</span>
              <span className="ml-auto bg-gray-800 px-3 py-1 rounded-full text-sm">
                Potential growth: {trendPredictions[0].growthPotential}x
              </span>
            </div>
          </div>
        )}
        
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex mb-4 sm:mb-0">
            <button
              className={`px-6 py-2 rounded-l-lg ${activeView === 'content' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              onClick={() => setActiveView('content')}
            >
              Content NFTs
            </button>
            <button
              className={`px-6 py-2 rounded-r-lg ${activeView === 'creators' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400'}`}
              onClick={() => setActiveView('creators')}
            >
              Creator Coins
            </button>
          </div>
          
          <div className="flex space-x-2">
            {/* Time Frame */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-800 text-white py-2 px-3 rounded"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="all">All Time</option>
            </select>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white py-2 px-3 rounded"
            >
              {activeView === 'content' ? (
                <>
                  <option value="trending">Trending</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </>
              ) : (
                <>
                  <option value="trending">Trending</option>
                  <option value="marketcap">Highest Market Cap</option>
                  <option value="followers">Most Followers</option>
                  <option value="content">Most Content</option>
                </>
              )}
            </select>
          </div>
        </div>
        
        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeView === 'content' ? (
              sortedData.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))
            ) : (
              sortedData.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
