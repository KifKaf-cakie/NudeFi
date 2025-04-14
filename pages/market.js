import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import CreatorCard from '../components/CreatorCard';
import { getAITrendPredictions } from '../services/aiService';
import { 
  fetchTrendingContent, 
  fetchTrendingCreators 
} from '../services/contentService';
import { 
  fetchTrendingCoins, 
  fetchTopVolumeCoins, 
  fetchMostValuableCoins 
} from '../services/zoraService';

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
        
        // Different fetch based on active view
        if (activeView === 'content') {
          // Use updated content service which uses Zora Coins SDK
          const content = await fetchTrendingContent(12);
          if (content && content.length > 0) {
            console.log("🔍 trending content sample:", content[0]);
            setTrendingContent(content);
          } else {
            setTrendingContent([]);
          }
        } else {
          // Use updated creators service which uses Zora Coins SDK
          const creators = await fetchTrendingCreators(12);
          if (creators && creators.length > 0) {
            setTrendingCreators(creators);
          } else {
            setTrendingCreators([]);
          }
          
          // Fetch additional market stats from Zora API
          try {
            const [topCoins, volumeCoins, valuableCoins] = await Promise.all([
              fetchTrendingCoins(5),
              fetchTopVolumeCoins(5),
              fetchMostValuableCoins(5)
            ]);
            
            // Update market stats with real data if available
            if (topCoins && topCoins.edges && topCoins.edges.length > 0) {
              // Calculate total volume
              const totalVolume = volumeCoins?.edges?.reduce((total, edge) => {
                const volume = parseFloat(edge.node.volume24h || '0');
                return total + (isNaN(volume) ? 0 : volume);
              }, 0) || 0;
              
              // Calculate average price
              const avgPrice = valuableCoins?.edges?.reduce((total, edge) => {
                const marketCap = parseFloat(edge.node.marketCap || '0');
                const supply = parseFloat(edge.node.totalSupply || '100000000');
                return total + (isNaN(marketCap) || isNaN(supply) || supply === 0 ? 0 : marketCap / supply);
              }, 0) / (valuableCoins?.edges?.length || 1);
              
              // Update market stats
              setMarketStats(prev => ({
                ...prev,
                volume24h: totalVolume.toFixed(2) + ' ETH',
                creatorCoins: (topCoins.edges.length).toString(),
                avgNFTPrice: isNaN(avgPrice) ? prev.avgNFTPrice : avgPrice.toFixed(4) + ' ETH',
              }));
            }
          } catch (apiError) {
            console.error("Error fetching market stats:", apiError);
            // Keep using mock data if API fails
          }
        }
        
        // Get AI trend predictions
        const predictions = await getAITrendPredictions();
        if (predictions && predictions.length > 0) {
          setTrendPredictions(predictions);
        } else {
          setTrendPredictions([]);
        }
      } catch (error) {
        console.error("Error loading market data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeView]);

  const getSortedData = () => {
    if (activeView === 'content') {
      if (!trendingContent || trendingContent.length === 0) return [];
      
      return [...trendingContent].sort((a, b) => {
        switch (sortBy) {
          case 'trending':
            return (b.trendScore || 0) - (a.trendScore || 0);
          case 'popular':
            return (b.mintCount || 0) - (a.mintCount || 0);
          case 'newest':
            return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
          case 'price-asc':
            return parseFloat(a.price || 0) - parseFloat(b.price || 0);
          case 'price-desc':
            return parseFloat(b.price || 0) - parseFloat(a.price || 0);
          default:
            return (b.trendScore || 0) - (a.trendScore || 0);
        }
      });
    } else {
      if (!trendingCreators || trendingCreators.length === 0) return [];
      
      return [...trendingCreators].sort((a, b) => {
        switch (sortBy) {
          case 'trending':
            return parseFloat(b.growth24h || 0) - parseFloat(a.growth24h || 0);
          case 'marketcap':
            return parseFloat(b.marketCap || 0) - parseFloat(a.marketCap || 0);
          case 'followers':
            return (b.followers || 0) - (a.followers || 0);
          case 'content':
            return (b.contentCount || 0) - (a.contentCount || 0);
          default:
            return parseFloat(b.growth24h || 0) - parseFloat(a.growth24h || 0);
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
            {sortedData && sortedData.length > 0 ? (
              activeView === 'content' ? (
                sortedData.map((content) => (
                  <ContentCard key={content.id || `content-${Math.random()}`} content={content} />
                ))
              ) : (
                sortedData.map((creator) => (
                  <CreatorCard key={creator.id || `creator-${Math.random()}`} creator={creator} />
                ))
              )
            ) : (
              <div className="col-span-3 text-center py-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400">No {activeView === 'content' ? 'content' : 'creators'} available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
