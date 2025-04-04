import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import CreatorCard from '../components/CreatorCard';
import TrendingContent from '../components/TrendingContent';
import { fetchTrendingCreators } from '../services/contentService';
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
      
      <main className="container mx-auto px-4 pt-20">
        {/* Hero Section */}
        <section className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="neon-glow">Adult Content</span> <span className="gradient-text">Revolution</span> 💋
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
              Empowering creators with NFTs, community tokens, and fair earnings on the Base chain
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              {!isConnected ? (
                <div className="pulse-btn">
                  <ConnectKitButton.Custom>
                    {({ isConnected, show }) => {
                      return (
                        <button 
                          onClick={show}
                          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg shadow-pink-500/30 transform transition hover:scale-105"
                        >
                          Connect & Start Exploring
                        </button>
                      );
                    }}
                  </ConnectKitButton.Custom>
                </div>
              ) : (
                <Link href="/explore" legacyBehavior>
                  <a className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg shadow-pink-500/30 transform transition hover:scale-105">
                    Explore Content
                  </a>
                </Link>
              )}
              <Link href="/creators" legacyBehavior>
                <a className="bg-gray-800 hover:bg-gray-700 border border-pink-500/30 text-white font-bold px-8 py-3 rounded-lg text-lg transform transition hover:scale-105">
                  Discover Creators
                </a>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Creator Ownership</h3>
                <p className="text-gray-300">Own your content and earn directly from your fans without intermediaries</p>
              </div>
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Creator Coins</h3>
                <p className="text-gray-300">Launch your personal token and build a community around your brand</p>
              </div>
              <div className="glass-card p-6">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Privacy & Security</h3>
                <p className="text-gray-300">Decentralized platform with age verification and content moderation</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Trend Predictions */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-2 flex items-center">
            <span className="mr-3">🔮</span>
            AI Trend Predictions
            <span className="ml-3 text-sm font-normal text-pink-500 bg-pink-500/10 px-3 py-1 rounded-full">Powered by TensorFlow</span>
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="sexy-loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendPredictions.map((prediction, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-pink-500/20 hover:border-pink-500/40 transition-all shadow-lg hover:shadow-pink-500/5">
                  <h3 className="text-xl font-semibold mb-2 text-pink-400">{prediction.title}</h3>
                  <p className="text-gray-300 mb-3">{prediction.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prediction.recommendedTags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <div className="mr-2 text-green-400">+{prediction.growthPotential}x</div>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                          style={{ width: `${prediction.growthPotential * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="bg-pink-500/20 text-pink-400 text-xs font-medium px-2 py-1 rounded-full">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Trending Creators */}
        <section className="py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold border-b border-gray-700 pb-2 flex items-center">
              <span className="mr-3">🔥</span>
              Trending Creators
            </h2>
            <Link href="/creators" legacyBehavior>
              <a className="text-pink-500 hover:text-pink-400 flex items-center anim-line-hover">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="sexy-loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingCreators.slice(0, 3).map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </section>
        
        {/* How It Works */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-2">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="sexy-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-500 font-bold">1</div>
                <h3 className="text-xl font-semibold mb-3">Create & Mint</h3>
                <p className="text-gray-300">Upload your adult content and mint it as an NFT. Each creator automatically gets their own ERC-20 token.</p>
              </div>
            </div>
            <div className="sexy-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-500 font-bold">2</div>
                <h3 className="text-xl font-semibold mb-3">Build Community</h3>
                <p className="text-gray-300">Fans can buy your creator token, join your community, and vote on your content direction.</p>
              </div>
            </div>
            <div className="sexy-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -mr-10 -mt-10 group-hover:bg-pink-500/20 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-500 font-bold">3</div>
                <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
                <p className="text-gray-300">Get paid when fans mint your NFTs and when they trade your creator token. Earn passive income forever.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 mb-12">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl p-10 border border-pink-500/20 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-600/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="text-pink-500 text-lg font-medium">Ready to get started?</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Join the Adult Content Revolution Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Create your first NFT, launch your creator token, and start building your community.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!isConnected ? (
                  <ConnectKitButton.Custom>
                    {({ isConnected, show }) => {
                      return (
                        <button 
                          onClick={show}
                          className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg shadow-pink-500/20 ripple-btn"
                        >
                          Connect Wallet to Start
                        </button>
                      );
                    }}
                  </ConnectKitButton.Custom>
                ) : (
                  <Link href="/dashboard" legacyBehavior>
                    <a className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg shadow-pink-500/20 ripple-btn">
                      Go to Creator Dashboard
                    </a>
                  </Link>
                )}
                <Link href="/explore" legacyBehavior>
                  <a className="bg-gray-900/80 hover:bg-gray-900 backdrop-blur-sm text-white border border-pink-500/30 font-bold text-lg px-8 py-3 rounded-lg shadow-lg ripple-btn">
                    Explore Content
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-pink-500 text-2xl font-bold mr-1">Nude</span>
              <span className="text-white text-2xl font-bold">Fi</span>
              <span className="text-pink-500 ml-1">💋</span>
            </div>
            <p className="text-gray-400 mb-4 md:mb-0">© 2025 NudeFi. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
