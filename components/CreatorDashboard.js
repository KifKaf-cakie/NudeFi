import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import ContentUploadForm from '../components/ContentUploadForm';
import ContentList from '../components/ContentList';
import { createContent, fetchCreatorContent, fetchCreatorCoin } from '../services/contentService';

export default function CreatorDashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [creatorContent, setCreatorContent] = useState([]);
  const [coinInfo, setCoinInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [refreshContent, setRefreshContent] = useState(0); // Counter to trigger refreshes
  
  useEffect(() => {
    if (!isConnected || !address) return;
    
    async function loadCreatorData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch creator's content using our updated service
        const content = await fetchCreatorContent(address);
        setCreatorContent(content);
        
        // Fetch creator's coin info
        const coin = await fetchCreatorCoin(address);
        setCoinInfo(coin);
      } catch (err) {
        console.error("Error loading creator data:", err);
        setError("Failed to load creator data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCreatorData();
  }, [address, isConnected, refreshContent]);
  
  // Handler for successful content creation
  const handleContentCreated = (newContent) => {
    setRefreshContent(prev => prev + 1); // Increment to trigger a refresh
    setActiveTab('content'); // Switch to content tab to show the new content
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Creator Dashboard | NudeFi</title>
        <meta name="description" content="Creator dashboard for managing adult content NFTs and coins" />
      </Head>
      
      {/* Add Header component for navigation */}
      <Header isConnected={isConnected} address={address} disconnect={disconnect} />
      
      <main className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <Link href="/" className="btn-secondary flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {isLoading && <p className="text-center py-8">Loading your creator data...</p>}
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <>
            {/* Creator coin stats */}
            {coinInfo ? (
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg mb-8 border border-pink-500/20 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="text-pink-400 mr-2">$</span>
                  Your Creator Coin: {coinInfo.symbol}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/80 p-4 rounded border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                    <p className="text-gray-400">Market Cap</p>
                    <p className="text-2xl font-bold">{coinInfo.marketCap} ETH</p>
                  </div>
                  <div className="bg-gray-800/80 p-4 rounded border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                    <p className="text-gray-400">24h Volume</p>
                    <p className="text-2xl font-bold">{coinInfo.volume24h} ETH</p>
                  </div>
                  <div className="bg-gray-800/80 p-4 rounded border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                    <p className="text-gray-400">Holders</p>
                    <p className="text-2xl font-bold">{coinInfo.uniqueHolders}</p>
                  </div>
                  <div className="bg-gray-800/80 p-4 rounded border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                    <p className="text-gray-400">Creator Earnings</p>
                    <p className="text-2xl font-bold text-pink-500">{coinInfo.creatorEarnings} ETH</p>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">
                  <p>Coin Address: {coinInfo.address}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-pink-500/20">
                <p>You don't have a creator coin yet. Upload your first content to create one!</p>
              </div>
            )}
            
            {/* Dashboard tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button 
                className={`py-2 px-4 mr-2 ${activeTab === 'content' ? 'border-b-2 border-pink-500 font-bold' : 'text-gray-400'}`}
                onClick={() => setActiveTab('content')}
              >
                My Content
              </button>
              <button 
                className={`py-2 px-4 mr-2 ${activeTab === 'upload' ? 'border-b-2 border-pink-500 font-bold' : 'text-gray-400'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload New
              </button>
              <button 
                className={`py-2 px-4 mr-2 ${activeTab === 'analytics' ? 'border-b-2 border-pink-500 font-bold' : 'text-gray-400'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`py-2 px-4 ${activeTab === 'community' ? 'border-b-2 border-pink-500 font-bold' : 'text-gray-400'}`}
                onClick={() => setActiveTab('community')}
              >
                Community
              </button>
            </div>
            
            {/* Tab content */}
            {activeTab === 'content' && (
              <ContentList 
                contents={creatorContent} 
                isCreator={true}
              />
            )}
            
            {activeTab === 'upload' && (
              <ContentUploadForm 
                onSuccess={handleContentCreated} 
              />
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Content Performance</h2>
                {creatorContent.length > 0 ? (
                  <div className="space-y-6">
                    {/* Content performance metrics would go here */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-pink-500/10">
                      <h3 className="text-xl font-semibold mb-4">Top Performing Content</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b border-gray-700">
                              <th className="pb-2">Content</th>
                              <th className="pb-2">Mints</th>
                              <th className="pb-2">Revenue</th>
                              <th className="pb-2">Engagement</th>
                            </tr>
                          </thead>
                          <tbody>
                            {creatorContent.slice(0, 5).map((content) => (
                              <tr key={content.id} className="border-b border-gray-700">
                                <td className="py-3">{content.title}</td>
                                <td className="py-3">{content.mintCount}</td>
                                <td className="py-3">{content.revenue || '0.00'} ETH</td>
                                <td className="py-3">{content.engagement || '0'}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg border border-pink-500/10">
                      <h3 className="text-xl font-semibold mb-4">AI Content Recommendations</h3>
                      <p className="mb-4">Based on your content performance and current trends, consider creating:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>More short-form videos (2-5 minutes) in the "roleplay" category</li>
                        <li>ASMR content targeting the Asian market</li>
                        <li>Interactive content with fan voting capabilities</li>
                        <li>Collaborative content with creators in the "cosplay" niche</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p>No content available for analysis. Upload your first content to get started!</p>
                )}
              </div>
            )}
            
            {activeTab === 'community' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Community Management</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg border border-pink-500/10">
                    <h3 className="text-xl font-semibold mb-4">Community Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Members:</span>
                        <span className="font-bold">{coinInfo?.uniqueHolders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Members (7d):</span>
                        <span className="font-bold">{coinInfo?.activeHolders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Members (7d):</span>
                        <span className="font-bold text-green-500">+{coinInfo?.newHolders || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Governance Proposals:</span>
                        <span className="font-bold">{coinInfo?.proposalCount || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-6 rounded-lg border border-pink-500/10">
                    <h3 className="text-xl font-semibold mb-4">Create a Proposal</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block mb-1">Title</label>
                        <input 
                          type="text" 
                          className="w-full bg-gray-700 p-2 rounded"
                          placeholder="What should we vote on?"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Description</label>
                        <textarea 
                          className="w-full bg-gray-700 p-2 rounded h-24"
                          placeholder="Describe your proposal in detail..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block mb-1">Voting Period</label>
                        <select className="w-full bg-gray-700 p-2 rounded">
                          <option value="259200">3 days (default)</option>
                          <option value="604800">1 week</option>
                          <option value="1209600">2 weeks</option>
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full"
                      >
                        Create Proposal
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Active Proposals</h3>
                  {coinInfo?.proposals && coinInfo.proposals.length > 0 ? (
                    <div className="space-y-4">
                      {coinInfo.proposals.map((proposal) => (
                        <div key={proposal.id} className="bg-gray-800 p-6 rounded-lg border border-pink-500/10">
                          <h4 className="text-lg font-semibold mb-2">{proposal.title}</h4>
                          <p className="text-gray-300 mb-4">{proposal.description}</p>
                          <div className="flex justify-between mb-2">
                            <span>Created by: {proposal.creator.substring(0, 6)}...{proposal.creator.substring(38)}</span>
                            <span>Ends in: {proposal.timeLeft}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                            <div 
                              className="bg-gradient-to-r from-pink-600 to-purple-600 h-4 rounded-full" 
                              style={{ width: `${(proposal.yesVotes / (proposal.yesVotes + proposal.noVotes) * 100) || 0}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm mb-4">
                            <span>Yes: {proposal.yesPercentage}%</span>
                            <span>No: {proposal.noPercentage}%</span>
                          </div>
                          <div className="flex space-x-4">
                            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex-1">
                              Vote Yes
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex-1">
                              Vote No
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No active proposals. Create one to engage your community!</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
