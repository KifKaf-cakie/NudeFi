import React, { useState, useEffect } from "react";
import { Heart, Lock, DollarSign, Sparkles, ChevronRight, Eye, Star, MessageCircle, Bookmark, Filter } from "lucide-react";

export default function ContentBrowser() {
  const [activeTab, setActiveTab] = useState('trending');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');

  // Content mock data
  const contentItems = [
    {
      id: 1,
      title: "Midnight Whispers",
      creator: "LaceGoddess",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23FF6B81'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23FF6B81'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M40,50 C45,53 55,53 60,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "LACE",
      contentType: "image",
      category: "lingerie",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23160c27'/><path d='M150,100 C150,60 250,60 250,100 C250,150 200,170 200,220 M200,250 L200,250' stroke='%23FF6B81' stroke-width='4' fill='none'/><rect x='140' y='80' width='120' height='10' rx='5' fill='%23FF6B81' fill-opacity='0.5'/><rect x='140' y='100' width='120' height='10' rx='5' fill='%23FF6B81' fill-opacity='0.5'/><rect x='120' y='200' width='160' height='30' rx='15' fill='%23FF6B81' fill-opacity='0.5'/><path d='M140,130 C160,150 240,150 260,130' stroke='%23FF6B81' stroke-width='4' fill='none'/></svg>",
      isSubscription: true,
      price: "0.05",
      mintCount: 132,
      likes: 87,
      isNew: true
    },
    {
      id: 2,
      title: "Secret Rendezvous",
      creator: "MidnightDream",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%239146FF'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%239146FF'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,45 C42,55 58,55 65,45' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "DREAM",
      contentType: "video",
      category: "roleplay",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231a0b25'/><rect x='100' y='50' width='200' height='200' rx='10' fill='%23370b4f' fill-opacity='0.6'/><circle cx='200' cy='150' r='30' stroke='%23ec4899' stroke-width='4' fill='none'/><polygon points='190,135 190,165 220,150' fill='%23ec4899'/></svg>",
      isSubscription: false,
      price: "0.08",
      mintCount: 94,
      likes: 63,
      isNew: false
    },
    {
      id: 3,
      title: "Silk Desires",
      creator: "SensualWhisper",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23570d47'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23570d47'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M40,50 C45,45 55,45 60,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "WHISP",
      contentType: "image",
      category: "lingerie",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><pattern id='silkPattern' patternUnits='userSpaceOnUse' width='20' height='20'><path d='M0,10 L20,10 M10,0 L10,20' stroke='%23ec4899' stroke-width='1' stroke-opacity='0.3'/></pattern></defs><rect width='400' height='300' fill='%23160c20'/><rect x='50' y='50' width='300' height='200' rx='15' fill='url(%23silkPattern)'/><path d='M200,100 Q300,75 325,150 Q300,225 200,200 Q100,225 75,150 Q100,75 200,100 Z' fill='%23570d47' fill-opacity='0.5' stroke='%23ec4899' stroke-width='2' stroke-opacity='0.6'/><path d='M170,150 C200,170 230,150 230,130' stroke='%23ec4899' stroke-width='2' fill='none'/></svg>",
      isSubscription: true,
      price: "0.06",
      mintCount: 118,
      likes: 95,
      isNew: true
    },
    {
      id: 4,
      title: "Intimate Confessions",
      creator: "ExoticBeauty",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%239146FF'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%239146FF'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,45 C42,40 58,40 65,45' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "EXOT",
      contentType: "audio",
      category: "asmr",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23160c20'/><circle cx='200' cy='150' r='50' stroke='%23ec4899' stroke-width='3' fill='none'/><path d='M150,150 C150,130 160,120 180,120 C200,120 205,140 200,150 C195,160 190,180 210,180 C230,180 240,170 240,150' stroke='%23ec4899' stroke-width='3' fill='none' stroke-linecap='round'/><path d='M170,70 Q173,90 176,110 M185,65 Q188,85 191,105 M200,60 Q203,80 206,100 M215,65 Q218,85 221,105 M230,70 Q233,90 236,110' stroke='%23ec4899' stroke-width='1.5' fill='none' stroke-opacity='0.6'/><path d='M170,230 Q173,210 176,190 M185,235 Q188,215 191,195 M200,240 Q203,220 206,200 M215,235 Q218,215 221,195 M230,230 Q233,210 236,190' stroke='%23ec4899' stroke-width='1.5' fill='none' stroke-opacity='0.6'/></svg>",
      isSubscription: false,
      price: "0.04",
      mintCount: 76,
      likes: 59,
      isNew: false
    },
    {
      id: 5,
      title: "Private Fantasy",
      creator: "DesireArtist",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23ec4899'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23ec4899'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,50 C42,45 58,45 65,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "DESIRE",
      contentType: "video",
      category: "roleplay",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23220b35'/><rect x='75' y='50' width='250' height='200' rx='20' fill='%23370b4f' fill-opacity='0.8'/><rect x='125' y='100' width='150' height='100' rx='10' fill='%23150920'/><path d='M175,140 Q200,120 225,140 Q200,160 175,140 Z' fill='%23ec4899' fill-opacity='0.7'/><path d='M195,200 L195,175 L210,175 L210,200' stroke='%23ec4899' stroke-width='3' fill='none'/></svg>",
      isSubscription: true,
      price: "0.09",
      mintCount: 143,
      likes: 112,
      isNew: true
    },
    {
      id: 6,
      title: "Velvet Touch",
      creator: "LaceGoddess",
      creatorAvatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23FF6B81'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23FF6B81'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M40,50 C45,53 55,53 60,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "LACE",
      contentType: "image",
      category: "lingerie",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23160c20'/><path d='M200,50 C250,50 300,100 300,150 C300,200 250,250 200,250 C150,250 100,200 100,150 C100,100 150,50 200,50 Z' fill='%23350b30' fill-opacity='0.6' stroke='%23FF6B81' stroke-width='2'/><path d='M160,150 Q200,180 240,150' stroke='%23FF6B81' stroke-width='3' fill='none'/><path d='M160,120 Q180,110 200,120 Q220,110 240,120' stroke='%23FF6B81' stroke-width='3' fill='none'/><path d='M150,200 Q175,190 200,200 Q225,190 250,200' stroke='%23FF6B81' stroke-width='3' fill='none'/></svg>",
      isSubscription: false,
      price: "0.055",
      mintCount: 89,
      likes: 72,
      isNew: false
    }
  ];

  // Filtered content based on selected filters
  const filteredContent = contentItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedContentType !== 'all' && item.contentType !== selectedContentType) return false;
    return true;
  });

  // Sort content based on active tab
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (activeTab === 'trending') return b.mintCount - a.mintCount;
    if (activeTab === 'newest') return b.isNew ? 1 : -1;
    if (activeTab === 'popular') return b.likes - a.likes;
    return 0;
  });

  // Creator profiles
  const creators = [
    {
      id: 1,
      name: "LaceGoddess",
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23FF6B81'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23FF6B81'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M40,50 C45,53 55,53 60,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "LACE",
      marketCap: "1.24",
      growth24h: "+15.7%",
      contentCount: 42,
      followers: 4700,
      isVerified: true
    },
    {
      id: 2,
      name: "MidnightDream",
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%239146FF'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%239146FF'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,45 C42,55 58,55 65,45' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "DREAM",
      marketCap: "0.95",
      growth24h: "+10.3%",
      contentCount: 36,
      followers: 3200,
      isVerified: true
    },
    {
      id: 3,
      name: "SensualWhisper",
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23570d47'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23570d47'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M40,50 C45,45 55,45 60,50' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "WHISP",
      marketCap: "0.78",
      growth24h: "+18.2%",
      contentCount: 29,
      followers: 2800,
      isVerified: false
    },
    {
      id: 4,
      name: "ExoticBeauty",
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%239146FF'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%239146FF'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,45 C42,40 58,40 65,45' stroke='white' stroke-width='2' fill='none'/></svg>",
      coinSymbol: "EXOT",
      marketCap: "0.65",
      growth24h: "+12.5%",
      contentCount: 24,
      followers: 1900,
      isVerified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 text-white">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 pt-8 pb-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Nude</span>
          <span className="text-3xl font-bold text-white">Fi</span>
          <span className="ml-1 text-2xl">💋</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-black/30 backdrop-blur-sm border border-pink-500/30 hover:border-pink-500/50 text-white font-bold px-4 py-2 rounded-lg transition-all">
            <Bookmark size={18} className="mr-2 inline-block" />
            Saved
          </button>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-pink-500/30 transition-all">
            Create Content
          </button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Explore
          </span> Adult Content
        </h1>

        {/* Tabs and Filters */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'trending' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
              onClick={() => setActiveTab('trending')}
            >
              <Sparkles size={16} className="mr-1 inline-block" />
              Trending
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'newest' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
              onClick={() => setActiveTab('newest')}
            >
              <Star size={16} className="mr-1 inline-block" />
              Newest
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'popular' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
              onClick={() => setActiveTab('popular')}
            >
              <Heart size={16} className="mr-1 inline-block" />
              Most Popular
            </button>
          </div>

          <button
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${filterOpen ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} className="mr-1" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-black/30 backdrop-blur-md border border-pink-500/20 rounded-lg p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedContentType === 'all' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedContentType('all')}
                >
                  All Types
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedContentType === 'image' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedContentType('image')}
                >
                  Images
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedContentType === 'video' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedContentType('video')}
                >
                  Videos
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedContentType === 'audio' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedContentType('audio')}
                >
                  Audio
                </button>
            </div>
          ))}
        </div>

        {/* Featured Creators Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Featured Creators
            </span>
            <span className="ml-auto text-sm text-pink-500 flex items-center group cursor-pointer">
              View All
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.map((creator) => (
              <div key={creator.id} className="bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10 p-4">
                <div className="flex items-center mb-3">
                  <div className="relative">
                    <img 
                      src={creator.avatar} 
                      alt={creator.name}
                      className="w-12 h-12 rounded-full border-2 border-pink-500/50"
                    />
                    {creator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-pink-500 rounded-full p-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold">{creator.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-pink-400 mr-1">$</span>
                      <span className="text-xs text-gray-300">{creator.coinSymbol}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Market Cap</p>
                    <p className="text-sm font-bold">{creator.marketCap} ETH</p>
                    <p className="text-green-500 text-xs">{creator.growth24h}</p>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Content</p>
                    <p className="text-sm font-bold">{creator.contentCount}</p>
                    <p className="text-gray-400 text-xs">{creator.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-black/50 hover:bg-black/70 text-white py-2 rounded-lg border border-pink-500/30 hover:border-pink-500/60 text-sm transition-colors">
                    View
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg text-sm transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Subscription Preview */}
        <div className="relative mt-16 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl filter blur-md"></div>
          <div className="relative bg-black/60 backdrop-blur-md rounded-xl p-8 border border-pink-500/30">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="text-2xl font-bold mb-3">Unlock Premium Content</h3>
                <p className="text-gray-300 mb-4">
                  Subscribe to creators for exclusive intimate content, personal messages, and behind-the-scenes experiences.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/50 p-3 rounded-lg border border-pink-500/20">
                    <p className="text-gray-400 text-xs mb-1">Starting from</p>
                    <p className="text-xl font-bold">0.03 ETH</p>
                    <p className="text-pink-500 text-xs">Monthly subscription</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg border border-pink-500/20">
                    <p className="text-gray-400 text-xs mb-1">Active Subscribers</p>
                    <p className="text-xl font-bold">12.5K+</p>
                    <p className="text-green-500 text-xs">+15% this month</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-pink-500/20 transition-all">
                  Explore Subscriptions
                </button>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <img 
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'><rect width='800' height='400' fill='%23220b35'/><circle cx='400' cy='200' r='150' fill='%23570d47' fill-opacity='0.6'/><path d='M250,200 C250,100 350,60 400,100 C450,60 550,100 550,200 C550,300 400,350 400,350 C400,350 250,300 250,200 Z' fill='%23350b30' fill-opacity='0.6' stroke='%23ec4899' stroke-width='4'/><rect x='300' y='100' width='200' height='15' rx='7.5' fill='%23ec4899' fill-opacity='0.5'/><rect x='300' y='130' width='200' height='15' rx='7.5' fill='%23ec4899' fill-opacity='0.5'/><rect x='250' y='280' width='300' height='20' rx='10' fill='%23ec4899' fill-opacity='0.5'/><path d='M330,200 C370,240 430,240 470,200' stroke='%23ec4899' stroke-width='4' fill='none'/></svg>"
                    alt="Subscription Preview"
                    className="w-full h-auto rounded-lg shadow-lg shadow-pink-500/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <img 
                          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='40' r='30' fill='%23ec4899'/><path d='M50,80 C65,80 75,85 85,100 C60,110 40,110 15,100 C25,85 35,80 50,80 Z' fill='%23ec4899'/><circle cx='40' cy='35' r='3' fill='white'/><circle cx='60' cy='35' r='3' fill='white'/><path d='M35,50 C42,45 58,45 65,50' stroke='white' stroke-width='2' fill='none'/></svg>"
                          alt="DesireArtist"
                          className="w-6 h-6 rounded-full border border-pink-500/50 mr-2"
                        />
                        <span className="text-sm font-bold">DesireArtist</span>
                      </div>
                      <div className="flex items-center bg-black/50 px-2 py-1 rounded-full">
                        <Lock size={12} className="text-pink-500 mr-1" />
                        <span className="text-xs">PREMIUM</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-2">Private Collection Access</h4>
                    <div className="bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-pink-500/20 inline-block">
                      <span className="text-sm font-bold">250 $DESIRE / month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-pink-500/10 py-8">
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
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === 'all' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Categories
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === 'lingerie' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedCategory('lingerie')}
                >
                  Lingerie
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === 'roleplay' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedCategory('roleplay')}
                >
                  Roleplay
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === 'asmr' ? 'bg-pink-600 text-white' : 'bg-black/30 text-gray-300 hover:bg-black/50'}`}
                  onClick={() => setSelectedCategory('asmr')}
                >
                  ASMR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContent.map((item) => (
                          <div key={item.id} className="group bg-black/30 backdrop-blur-md rounded-xl overflow-hidden border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-102 hover:shadow-lg hover:shadow-pink-500/10">
              <div className="relative">
                {/* Content Preview Image */}
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Content Type Badge */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-pink-500/30 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  {item.contentType === 'image' && (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      IMAGE
                    </>
                  )}
                  {item.contentType === 'video' && (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      VIDEO
                    </>
                  )}
                  {item.contentType === 'audio' && (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      AUDIO
                    </>
                  )}
                </div>
                
                {/* New Badge */}
                {item.isNew && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                )}
                
                {/* Subscription Badge */}
                {item.isSubscription && (
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-pink-500/30 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Lock size={12} className="mr-1 text-pink-500" />
                    SUBSCRIPTION
                  </div>
                )}
                
                {/* Play button for videos */}
                {item.contentType === 'video' && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-pink-600/80 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                )}
                
                {/* Audio waveform for audio content */}
                {item.contentType === 'audio' && (
                  <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                    <div className="flex items-center space-x-1 h-8">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-1 bg-pink-500/70 rounded-full" 
                          style={{ 
                            height: `${10 + Math.sin(i/2) * 16}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {/* Creator info */}
                <div className="flex items-center mb-3">
                  <img 
                    src={item.creatorAvatar} 
                    alt={item.creator}
                    className="w-6 h-6 rounded-full mr-2 border border-pink-500/50"
                  />
                  <span className="text-sm text-gray-300">@{item.creator}</span>
                  <div className="ml-auto flex items-center bg-black/50 px-2 py-1 rounded-full">
                    <span className="text-xs text-pink-400 mr-1">$</span>
                    <span className="text-xs">{item.coinSymbol}</span>
                  </div>
                </div>
                
                {/* Content title */}
                <h3 className="text-lg font-bold mb-2 group-hover:text-pink-400 transition-colors">{item.title}</h3>
                
                {/* Stats and price */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Heart size={14} className="text-pink-500 mr-1" />
                      <span className="text-xs text-gray-300">{item.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="text-gray-400 mr-1" />
                      <span className="text-xs text-gray-300">{item.mintCount}</span>
                    </div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg border border-pink-500/20">
                    <span className="text-sm font-bold">{item.price} ETH</span>
                  </div>
                </div>
              </div>
              
              {/* Hover overlay with buttons */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none group-hover:pointer-events-auto">
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition-all">
                    Purchase
                  </button>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-black/50 hover:bg-black/70 text-white py-2 rounded-lg border border-pink-500/30 hover:border-pink-500/60 transition-colors flex items-center justify-center">
                      <Heart size={16} className="mr-1" />
                      Like
                    </button>
                    <button className="flex-1 bg-black/50 hover:bg-black/70 text-white py-2 rounded-lg border border-pink-500/30 hover:border-pink-500/60 transition-colors flex items-center justify-center">
                      <Bookmark size={16} className="mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
              </div>
