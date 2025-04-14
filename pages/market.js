import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import Header from '../components/Header';
import { getAITrendPredictions } from '../services/aiService';

export default function MarketPage() {
  const { address, isConnected } = useAccount();

  const [activeView, setActiveView] = useState('content');
  const [trendingContent, setTrendingContent] = useState([]);
  const [trendingCreators, setTrendingCreators] = useState([]);
  const [trendPredictions, setTrendPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('trending');
  const [timeframe, setTimeframe] = useState('24h');
  const [marketStats, setMarketStats] = useState({
    volume24h: '12.45 ETH',
    activeNFTs: '1,257',
    creatorCoins: '89',
    avgNFTPrice: '0.068 ETH',
    volumeChange: '+5.2%',
    nftChange: '+12',
    coinChange: '+3',
    priceChange: '-0.8%'
  });

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Mock AI trend predictions
        const mockPredictions = [
          {
            title: "ASMR Content Rising",
            description: "ASMR-focused adult content is gaining popularity, with 47% increase in trading volume over the past 2 weeks.",
            confidence: 89,
            growthPotential: 2.4,
            recommendedTags: ["asmr", "whisper", "closeup", "intimate"]
          },
          {
            title: "Roleplay Narratives",
            description: "Storyline-driven content with character development is outperforming simple scenes by 3.2x in retention metrics.",
            confidence: 92,
            growthPotential: 3.2,
            recommendedTags: ["roleplay", "story", "fantasy", "character"]
          }
        ];
        
        setTrendPredictions(mockPredictions);
      } catch (error) {
        console.error("Error loading market data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeView]);

  // Load static default card components instead of trying to render dynamic content
  const renderDummyCards = () => {
    const count = 6;
    return Array(count).fill(0).map((_, index) => (
      <div key={`dummy-${index}`} className="bg-gray-800 p-6 rounded-lg">
        <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Market - NudeFi</title>
        <meta name="description" content="NudeFi marketplace for adult content NFTs and creator coins" />
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">NFT Market</h1>
          <p className="text-gray-400">Buy and trade adult content NFTs and creator coins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">24h Volume</p>
            <p className="text-2xl font-bold">{marketStats.volume24h}</p>
            <p className="text-green-500 text-sm">{marketStats.volumeChange}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Active NFTs</p>
            <p className="text-2xl font-bold">{marketStats.activeNFTs}</p>
            <p className="text-green-500 text-sm">{marketStats.nftChange} today</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Creator Coins</p>
            <p className="text-2xl font-bold">{marketStats.creatorCoins}</p>
            <p className="text-green-500 text-sm">{marketStats.coinChange} today</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 mb-1">Avg. NFT Price</p>
            <p className="text-2xl font-bold">{marketStats.avgNFTPrice}</p>
            <p className="text-red-500 text-sm">{marketStats.priceChange}</p>
          </div>
        </div>

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

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Render dummy cards instead of actual components that might be causing errors */}
            {renderDummyCards()}
          </div>
        )}
      </main>
    </div>
  );
}
