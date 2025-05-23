import Link from "next/link";
import React, { useState } from "react";
import {
  Heart,
  Eye,
  Lock,
  Filter,
} from "lucide-react";

export default function ContentBrowser() {
  const [activeTab, setActiveTab] = useState("trending");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContentType, setSelectedContentType] = useState("all");

const contentItems = [
  {
    id: 1,
    title: "Beautiful Sunset",
    creator: "PhotoCreator",
    creatorAvatar: "",
    coinSymbol: "PHOTO",
    contentType: "image",
    category: "artistic",
    image: "/images/content/photo-content.png",
    isSubscription: true,
    price: "0.05",
    mintCount: 120,
    likes: 99,
    isNew: true,
  },
  {
    id: 2,
    title: "Sensual Dance",
    creator: "VideoCreator",
    creatorAvatar: "",
    coinSymbol: "VIDEO",
    contentType: "video",
    category: "performance",
    image: "/images/content/video-content.png",
    isSubscription: false,
    price: "0.08",
    mintCount: 85,
    likes: 67,
    isNew: false,
  },
  {
    id: 3,
    title: "Midnight Whispers",
    creator: "AudioCreator",
    creatorAvatar: "",
    coinSymbol: "AUDIO",
    contentType: "audio",
    category: "asmr",
    image: "/images/content/audio-content.png",
    isSubscription: true,
    price: "0.03",
    mintCount: 42,
    likes: 31,
    isNew: true,
  },
];

  const filteredContent = contentItems.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (selectedContentType !== "all" && item.contentType !== selectedContentType) return false;
    return true;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    if (activeTab === "trending") return b.mintCount - a.mintCount;
    if (activeTab === "newest") return b.isNew ? 1 : -1;
    if (activeTab === "popular") return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white px-4 py-10">
        <div className="container mx-auto mb-6">
      <Link href="/" className="flex items-center text-pink-400 hover:text-pink-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>
    </div>
          
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 rounded-full font-bold ${activeTab === "trending" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-300"}`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab("newest")}
            className={`px-4 py-2 rounded-full font-bold ${activeTab === "newest" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-300"}`}
          >
            Newest
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-4 py-2 rounded-full font-bold ${activeTab === "popular" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-300"}`}
          >
            Popular
          </button>
        </div>

        <button onClick={() => setFilterOpen(!filterOpen)} className="text-pink-400 hover:text-pink-600 flex items-center gap-2">
          <Filter size={20} /> Filters
        </button>
      </div>

      {filterOpen && (
        <div className="bg-black/40 p-6 rounded-xl border border-pink-500/10 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Content Type</label>
              <div className="flex flex-col gap-2">
                {['all', 'image', 'video', 'audio'].map(type => (
                  <button key={type} onClick={() => setSelectedContentType(type)}
                    className={`px-3 py-1 rounded-lg text-sm ${selectedContentType === type ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{type}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Category</label>
              <div className="flex flex-col gap-2">
                {['all', 'lingerie', 'roleplay', 'asmr'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-sm ${selectedCategory === cat ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{cat}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContent.map((item) => (
          <div key={item.id} className="bg-black/30 p-4 rounded-xl border border-pink-500/10 hover:border-pink-500/30 shadow-md">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <div>
              <p className="text-pink-400 text-sm mb-1">@{item.creator}</p>
              <h3 className="text-xl font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-gray-300 mb-2">{item.price} ETH</p>
              <div className="flex items-center text-sm text-gray-400 gap-4 mb-2">
                <span className="flex items-center gap-1"><Heart size={14} /> {item.likes}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {item.mintCount}</span>
              </div>
              {item.isSubscription && <span className="inline-flex items-center text-xs text-yellow-400"><Lock size={12} className="mr-1" /> Subscription</span>}
              {item.isNew && <span className="text-xs text-pink-400 ml-2">NEW</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
