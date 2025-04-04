import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const mockTopGainers = [
  { name: "Creative Coin", symbol: "CREAT", marketCap: "$124,567", volume24h: "$45,678", priceChange: "+12.3%" },
  { name: "Art Token", symbol: "ART", marketCap: "$98,765", volume24h: "$32,456", priceChange: "+8.7%" },
  { name: "Music Money", symbol: "MUSIC", marketCap: "$76,543", volume24h: "$22,345", priceChange: "+6.5%" },
];

const mockNewCoins = [
  { name: "Startup Coin", symbol: "START", marketCap: "$12,345", volume24h: "$3,456", createdAt: "2 days ago" },
  { name: "Innovation Token", symbol: "INNOV", marketCap: "$9,876", volume24h: "$2,345", createdAt: "1 day ago" },
  { name: "Trend Coin", symbol: "TREND", marketCap: "$7,654", volume24h: "$1,987", createdAt: "3 days ago" },
];

const mockMostValuable = [
  { name: "Creator King", symbol: "KING", marketCap: "$987,654", volume24h: "$234,567", holders: "5,678" },
  { name: "Media Master", symbol: "MEDIA", marketCap: "$765,432", volume24h: "$189,054", holders: "4,321" },
  { name: "Content Crown", symbol: "CONT", marketCap: "$543,210", volume24h: "$132,456", holders: "3,210" },
];

const CreatorsPage = () => {
  const [activeTab, setActiveTab] = useState('topGainers');

  const renderCoinList = (coins) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coins.map((coin, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-5 shadow-md border border-pink-500/10 hover:border-pink-500/30 transition">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-white">{coin.name}</h3>
            <span className="text-sm text-pink-300">{coin.symbol}</span>
          </div>
          <div className="text-gray-300 space-y-1 text-sm">
            <p>Market Cap: <span className="font-semibold text-white">{coin.marketCap}</span></p>
            <p>24h Volume: <span className="font-semibold text-white">{coin.volume24h}</span></p>
            {coin.priceChange && <p className="text-green-400">Change: {coin.priceChange}</p>}
            {coin.createdAt && <p className="text-gray-400">Created: {coin.createdAt}</p>}
            {coin.holders && <p className="text-gray-400">Holders: {coin.holders}</p>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'topGainers': return renderCoinList(mockTopGainers);
      case 'newCoins': return renderCoinList(mockNewCoins);
      case 'mostValuable': return renderCoinList(mockMostValuable);
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Creator Rankings | NudeFi</title>
      </Head>

      {/* 共通ヘッダー */}
      <Header />

      <main className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-pink-500">Creator Rankings</h1>
          <Link href="/" className="text-pink-400 hover:text-pink-300 underline">
            ← Back to Home
          </Link>
        </div>

        {/* タブ切り替え */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'topGainers' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveTab('topGainers')}
          >
            Top Gainers
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'newCoins' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveTab('newCoins')}
          >
            New Coins
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-semibold ${activeTab === 'mostValuable' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            onClick={() => setActiveTab('mostValuable')}
          >
            Most Valuable
          </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default CreatorsPage;
