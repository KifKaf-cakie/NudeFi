import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Head from 'next/head';
import Header from '../components/Header';
import CreatorCard from '../components/CreatorCard';
import TrendingContent from '../components/TrendingContent';
import { fetchTrendingCreators } from '../services/creatorService';
import { getAITrendPredictions } from '../services/aiService';
import { ConnectKitButton } from 'connectkit';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [trendingCreators, setTrendingCreators] = useState([]);
  const [trendPredictions, setTrendPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Fetch trending creators
        const creators = await fetchTrendingCreators();
        setTrendingCreators(creators);
        
        // Get AI trend predictions
        const predictions = await getAITrendPredictions();
        setTrendPredictions(predictions);
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>NudeFi - Decentralized Adult Content Platform</title>
        <meta name="description" content="Adult content NFT platform powered by Zora's Coins Protocol" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header isConnected={isConnected} address={address} disconnect={disconnect} />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Adult Content Revolution</h1>
            <p className="text-xl mb-8">
              Empowering creators with NFTs, community tokens, and fair earnings on the Base chain
            </p>
          </div>
        </section>
        <div className="flex justify-center">
        <ConnectKitButton />
        </div>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">AI Trend Predictions 🔮</h2>
          {isLoading ? (
            <p>Loading trend predictions...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendPredictions.map((prediction, index) => (
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
          )}
        </section>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Trending Creators 🔥</h2>
          {isLoading ? (
            <p>Loading trending creators...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">1. Create & Mint</h3>
              <p>Upload your adult content and mint it as an NFT. Each creator automatically gets their own ERC-20 token.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">2. Build Community</h3>
              <p>Fans can buy your creator token, join your community, and vote on your content direction.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">3. Earn Rewards</h3>
              <p>Get paid when fans mint your NFTs and when they trade your creator token. Earn passive income forever.</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 NudeFi. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
