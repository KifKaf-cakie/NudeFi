import { useState } from 'react';
import { useEffect } from 'react';
import Head from 'next/head';
import { useAccount, useDisconnect } from 'wagmi';
import { base } from 'viem/chains';
import Header from '../components/Header';
import { fetchUserProfile, fetchUserCoinBalances } from '../services/zoraService';
import { Heart, Edit, Copy, Link, MessageCircle, DollarSign, Image, Video, AlertTriangle } from 'lucide-react';

const mockProfileData = {
  displayName: "Creative Creator",
  handle: "creativecreator",
  avatar: "https://via.placeholder.com/150",
  bio: "Passionate about creating unique digital experiences and exploring the world of adult content creation.",
  followers: 1234,
  following: 567,
  earnings: "0.87 ETH",
  contentCount: 24,
  linkedWallets: [
    { walletType: "Ethereum", walletAddress: "0x1234...5678" },
    { walletType: "Base", walletAddress: "0x8765...4321" }
  ]
};

const mockComments = [
  {
    author: {
      handle: "artfan",
      avatar: "https://via.placeholder.com/50",
      address: "0x9876...5432"
    },
    text: "Amazing work! Love the creativity in this piece.",
    createdAt: "2 hours ago",
    reactions: [
      { type: 'like', count: 15 },
      { type: 'comment', count: 3 }
    ]
  },
  {
    author: {
      handle: "collector007",
      avatar: "https://via.placeholder.com/50",
      address: "0x1111...2222"
    },
    text: "Your subscription content is absolutely worth every penny. Looking forward to more!",
    createdAt: "5 hours ago",
    reactions: [
      { type: 'like', count: 8 },
      { type: 'comment', count: 1 }
    ]
  }
];

const mockContent = [
  { id: 1, title: "Private Moments", type: "image", thumbnail: "https://via.placeholder.com/300x200", mintCount: 18, price: "0.05 ETH" },
  { id: 2, title: "Sunset Escape", type: "video", thumbnail: "https://via.placeholder.com/300x200", mintCount: 12, price: "0.08 ETH" },
  { id: 3, title: "Whispers", type: "audio", thumbnail: "https://via.placeholder.com/300x200", mintCount: 7, price: "0.03 ETH" },
  { id: 4, title: "After Hours", type: "image", thumbnail: "https://via.placeholder.com/300x200", mintCount: 24, price: "0.06 ETH" },
];

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  useEffect(() => {
  const loadProfile = async () => {
    if (!isConnected || !address) return;
    try {
      const user = await fetchUserProfile(address);
      const balances = await fetchUserCoinBalances(address);
  setProfileData((prev) => ({
    ...prev,
    handle: user?.handle || prev.handle,
    bio: user?.bio || prev.bio,
    linkedWallets: [
    ...(user?.linkedWallets || []),
    {
      walletType: base.id === 8453 ? 'Base' : 'Ethereum',
      walletAddress: address,
    },
  ],
  }));

    } catch (err) {
      console.error('Failed to load profile from Zora SDK:', err);
    }
  };
  loadProfile();
}, [isConnected, address]);

  const [profileData, setProfileData] = useState(mockProfileData);
  const [comments] = useState(mockComments);
  const [content] = useState(mockContent);
  const [activeTab, setActiveTab] = useState('content');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileData.handle);
    alert('Handle copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>{profileData.displayName} | NudeFi Profile</title>
        <meta name="description" content="Creator profile on NudeFi platform" />
      </Head>

      <Header isConnected={isConnected} address={address} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* プロフィールカード */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-pink-500/20 mb-8">
          <div className="h-40 bg-gradient-to-r from-pink-600/30 to-purple-800/30 relative">
            <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden shadow-xl">
              <img 
                src={profileData.avatar} 
                alt={profileData.displayName} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="pt-20 p-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold mr-2">{profileData.displayName}</h1>
                  <button onClick={copyToClipboard} className="text-gray-400 hover:text-pink-500 transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-gray-400">@{profileData.handle}</p>
              </div>
              
              <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg transition-all flex items-center shadow-lg shadow-pink-500/10">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>
            
            <p className="mt-4 text-gray-300 max-w-3xl">{profileData.bio}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-2xl font-bold">{profileData.followers.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                <p className="text-gray-400 text-sm">Following</p>
                <p className="text-2xl font-bold">{profileData.following.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                <p className="text-gray-400 text-sm">Earnings</p>
                <p className="text-2xl font-bold text-pink-500">{profileData.earnings}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                <p className="text-gray-400 text-sm">Content</p>
                <p className="text-2xl font-bold">{profileData.contentCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="flex border-b border-gray-700 mb-8">
          <button 
            className={`px-6 py-3 font-medium relative ${activeTab === 'content' ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('content')}
          >
            <span className="flex items-center">
              <Image size={18} className="mr-2" />
              Content
            </span>
            {activeTab === 'content' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500"></span>}
          </button>
          <button 
            className={`px-6 py-3 font-medium relative ${activeTab === 'comments' ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('comments')}
          >
            <span className="flex items-center">
              <MessageCircle size={18} className="mr-2" />
              Comments
            </span>
            {activeTab === 'comments' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500"></span>}
          </button>
          <button 
            className={`px-6 py-3 font-medium relative ${activeTab === 'earnings' ? 'text-pink-500' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('earnings')}
          >
            <span className="flex items-center">
              <DollarSign size={18} className="mr-2" />
              Earnings
            </span>
            {activeTab === 'earnings' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-pink-500"></span>}
          </button>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {content.map(item => (
              <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md border border-pink-500/10 hover:border-pink-500/30 transition-all hover:shadow-lg hover:shadow-pink-500/5 group">
                <div className="relative">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <span className="text-white font-bold">{item.price}</span>
                    <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.type === 'image' ? 'IMAGE' : item.type === 'video' ? 'VIDEO' : 'AUDIO'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Heart size={16} className="mr-1 text-pink-500" />
                      {item.mintCount} mints
                    </div>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-gray-800/50 rounded-lg border border-dashed border-pink-500/30 flex items-center justify-center h-80 col-span-1">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-pink-500" />
                </div>
                <p className="text-lg font-medium text-pink-500">Create New Content</p>
                <p className="text-sm text-gray-400 mt-2">Upload images, videos or audio</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-pink-500/10">
                <div className="flex items-start">
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.handle} 
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <p className="font-medium mr-2">@{comment.author.handle}</p>
                      <p className="text-gray-400 text-sm">{comment.createdAt}</p>
                    </div>
                    <p className="text-gray-300">{comment.text}</p>
                    <div className="mt-3 flex space-x-4">
                      <button className="flex items-center text-gray-400 hover:text-pink-500 transition-colors">
                        <Heart size={16} className="mr-1" />
                        {comment.reactions[0].count}
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-pink-500 transition-colors">
                        <MessageCircle size={16} className="mr-1" />
                        {comment.reactions[1].count}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-gray-800 rounded-lg p-6 border border-pink-500/10">
              <div className="flex items-start">
                <img 
                  src="https://via.placeholder.com/50" 
                  alt="Your avatar" 
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <textarea 
                    placeholder="Add a comment..." 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-pink-500 focus:border-transparent min-h-[100px]"
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="bg-gray-800 rounded-lg p-6 border border-pink-500/10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Earnings Overview</h2>
              <div className="flex space-x-2">
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm">
                  Today
                </button>
                <button className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded-lg text-sm">
                  This Week
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm">
                  This Month
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-sm">
                  All Time
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-700 p-5 rounded-lg border border-pink-500/10">
                <p className="text-gray-400 mb-1">Content Sales</p>
                <p className="text-3xl font-bold">0.54 ETH</p>
                <p className="text-green-500 text-sm">+12% this week</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-pink-500/10">
                <p className="text-gray-400 mb-1">Coin Trading Fees</p>
                <p className="text-3xl font-bold">0.23 ETH</p>
                <p className="text-green-500 text-sm">+5% this week</p>
              </div>
              <div className="bg-gray-700 p-5 rounded-lg border border-pink-500/10">
                <p className="text-gray-400 mb-1">Subscriptions</p>
                <p className="text-3xl font-bold">0.10 ETH</p>
                <p className="text-red-500 text-sm">-2% this week</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-5 rounded-lg mb-6">
              <h3 className="text-xl font-bold mb-4">Top Performing Content</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-2">Content</th>
                      <th className="text-right py-2">Mints</th>
                      <th className="text-right py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.map(item => (
                      <tr key={item.id} className="border-b border-gray-600/50">
                        <td className="py-3 flex items-center">
                          <img src={item.thumbnail} alt={item.title} className="w-10 h-10 object-cover rounded mr-3" />
                          {item.title}
                        </td>
                        <td className="text-right py-3">{item.mintCount}</td>
                        <td className="text-right py-3 font-medium">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const Plus = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default ProfilePage;
