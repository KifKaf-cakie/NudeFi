import React, { useState } from "react";
import {
  Heart,
  DollarSign,
  MessageCircle,
  Users,
  TrendingUp,
  Gift,
  Lock,
  Bookmark,
  Star,
  Image as ImageIcon,
  Film,
  Music,
  Copy,
  ChevronRight
} from "lucide-react";

export default function CreatorProfile() {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedContentType, setSelectedContentType] = useState("all");

  // Mock creator
  const creator = {
    name: "SensualWhisper",
    avatar: "https://via.placeholder.com/100x100.png?text=SW",
    verified: true,
    bio: "Exclusive intimate content creator specializing in whispered fantasies and visual temptations.",
    coinSymbol: "WHISP",
    stats: {
      marketCap: "0.95 ETH",
      coinPrice: "0.00042 ETH",
      followers: "4.7K",
      contentSales: "0.87 ETH"
    }
  };

  const contents = [
    {
      id: 1,
      title: "Midnight Whispers Vol.3",
      type: "audio",
      isSubscription: true,
      price: "0.04",
      mintCount: 87,
      likes: 62,
      image: "https://via.placeholder.com/400x300.png?text=Audio+Preview"
    },
    {
      id: 2,
      title: "Secret Desires",
      type: "image",
      isSubscription: true,
      price: "0.06",
      mintCount: 143,
      likes: 124,
      image: "https://via.placeholder.com/400x300.png?text=Image+Preview"
    },
    {
      id: 3,
      title: "Dreams in Lace",
      type: "image",
      isSubscription: false,
      price: "0.05",
      mintCount: 128,
      likes: 98,
      image: "https://via.placeholder.com/400x300.png?text=Image+Preview"
    }
  ];

  const filteredContents = selectedContentType === "all"
    ? contents
    : contents.filter(c => c.type === selectedContentType);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-20 h-20 rounded-full border-4 border-pink-500"
          />
          <div className="ml-4">
            <h1 className="text-3xl font-bold">{creator.name} {creator.verified && <span className="text-pink-400">✔</span>}</h1>
            <p className="text-gray-400">${creator.coinSymbol} Creator</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Market Cap</p>
            <p className="text-xl font-bold">{creator.stats.marketCap}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Coin Price</p>
            <p className="text-xl font-bold">{creator.stats.coinPrice}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Followers</p>
            <p className="text-xl font-bold">{creator.stats.followers}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Content Sales</p>
            <p className="text-xl font-bold">{creator.stats.contentSales}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <select
            value={selectedContentType}
            onChange={(e) => setSelectedContentType(e.target.value)}
            className="bg-gray-800 p-2 rounded text-white"
          >
            <option value="all">All</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map(content => (
            <div key={content.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img src={content.image} alt={content.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{content.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-pink-400 font-bold">{content.price} ETH</span>
                  <span className="text-sm text-gray-400 flex items-center">
                    <Heart size={14} className="mr-1" /> {content.likes}
                  </span>
                </div>
                {content.isSubscription && (
                  <div className="mt-2 inline-block bg-pink-600 text-white text-xs px-2 py-1 rounded">Subscription Only</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
