import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import ContentList from '../components/ContentList';
import { fetchTrendingContent } from '../services/contentService';
import { getAITrendPredictions } from '../services/aiService';
import { useAccount, useDisconnect } from 'wagmi'; 

export default function ExplorePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect(); 

  const [trendingContent, setTrendingContent] = useState([]);
  const [trendPredictions, setTrendPredictions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const content = await fetchTrendingContent(18);
        setTrendingContent(content);
        const predictions = await getAITrendPredictions();
        setTrendPredictions(predictions);
      } catch (error) {
        console.error("Error loading explore data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Explore - NudeFi</title>
        <meta name="description" content="Explore adult content NFTs on NudeFi" />
      </Head>

      <Header isConnected={isConnected} address={address} disconnect={disconnect} /> 
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Content</h1>
          <p className="text-gray-400">Discover and collect exclusive adult content from creators around the world.</p>
        </div>
        
        {/* Trend Predictions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">AI Trend Predictions 🔮</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendPredictions.slice(0, 2).map((prediction, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{prediction.title}</h3>
                <p className="text-gray-300 mb-3">{prediction.description}</p>
                <div className="flex items-center">
                  <span className="text-pink-500 font-bold">{prediction.confidence}% confidence</span>
                  <span className="ml-auto text-green-400">Predicted to grow {prediction.growthPotential}x</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Category Navigation */}
        <div className="flex overflow-x-auto pb-2 mb-8 hide-scrollbar">
          <button
            className={`whitespace-nowrap px-6 py-3 rounded-full mr-3 ${activeCategory === 'trending' ? 'bg-pink-600 text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveCategory('trending')}
          >
            Trending Now
          </button>
          <button
            className={`whitespace-nowrap px-6 py-3 rounded-full mr-3 ${activeCategory === 'recent' ? 'bg-pink-600 text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveCategory('recent')}
          >
            Recently Added
          </button>
          <button
            className={`whitespace-nowrap px-6 py-3 rounded-full mr-3 ${activeCategory === 'popular' ? 'bg-pink-600 text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveCategory('popular')}
          >
            Most Popular
          </button>
          <button
            className={`whitespace-nowrap px-6 py-3 rounded-full mr-3 ${activeCategory === 'subscriptions' ? 'bg-pink-600 text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveCategory('subscriptions')}
          >
            Subscription Only
          </button>
        </div>
        
        {/* Content Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <ContentList 
            contents={getCategoryContent()} 
            title={
              activeCategory === 'trending' ? 'Trending Content' :
              activeCategory === 'recent' ? 'Recently Added' :
              activeCategory === 'popular' ? 'Most Popular' :
              'Subscription Only Content'
            }
          />
        )}
      </main>
    </div>
  );
}
