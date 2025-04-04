import React, { useState } from 'react';

// モックデータを定義（外部に移動）
const mockTopGainers = [
  { 
    name: "Creative Coin", 
    symbol: "CREAT", 
    marketCap: "$124,567", 
    volume24h: "$45,678",
    priceChange: "+12.3%"
  },
  { 
    name: "Art Token", 
    symbol: "ART", 
    marketCap: "$98,765", 
    volume24h: "$32,456",
    priceChange: "+8.7%"
  },
  { 
    name: "Music Money", 
    symbol: "MUSIC", 
    marketCap: "$76,543", 
    volume24h: "$22,345",
    priceChange: "+6.5%"
  }
];

const mockNewCoins = [
  { 
    name: "Startup Coin", 
    symbol: "START", 
    marketCap: "$12,345", 
    volume24h: "$3,456",
    createdAt: "2 days ago"
  },
  { 
    name: "Innovation Token", 
    symbol: "INNOV", 
    marketCap: "$9,876", 
    volume24h: "$2,345",
    createdAt: "1 day ago"
  },
  { 
    name: "Trend Coin", 
    symbol: "TREND", 
    marketCap: "$7,654", 
    volume24h: "$1,987",
    createdAt: "3 days ago"
  }
];

const mockMostValuable = [
  { 
    name: "Creator King", 
    symbol: "KING", 
    marketCap: "$987,654", 
    volume24h: "$234,567",
    holders: "5,678"
  },
  { 
    name: "Media Master", 
    symbol: "MEDIA", 
    marketCap: "$765,432", 
    volume24h: "$189,054",
    holders: "4,321"
  },
  { 
    name: "Content Crown", 
    symbol: "CONT", 
    marketCap: "$543,210", 
    volume24h: "$132,456",
    holders: "3,210"
  }
];

const CreatorsPage = () => {
  const [activeTab, setActiveTab] = useState('topGainers');

  // コインリストをレンダリングする共通関数
  const renderCoinList = (coins) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coins.map((coin, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{coin.name}</h3>
            <span className="text-sm text-gray-500">{coin.symbol}</span>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm">Market Cap</p>
              <p className="font-semibold">{coin.marketCap}</p>
            </div>
            <div>
              <p className="text-sm">24h Volume</p>
              <p className="font-semibold">{coin.volume24h}</p>
            </div>
          </div>
          {coin.priceChange && (
            <div className="mt-2 text-green-600 font-semibold">
              {coin.priceChange}
            </div>
          )}
          {coin.createdAt && (
            <div className="mt-2 text-gray-500 text-sm">
              Created: {coin.createdAt}
            </div>
          )}
          {coin.holders && (
            <div className="mt-2 text-gray-500 text-sm">
              Holders: {coin.holders}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // アクティブタブに基づいてコンテンツをレンダリング
  const renderContent = () => {
    switch (activeTab) {
      case 'topGainers':
        return renderCoinList(mockTopGainers);
      case 'newCoins':
        return renderCoinList(mockNewCoins);
      case 'mostValuable':
        return renderCoinList(mockMostValuable);
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Creators Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button 
            className={`px-4 py-2 rounded ${activeTab === 'topGainers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('topGainers')}
          >
            Top Gainers
          </button>
          <button 
            className={`px-4 py-2 rounded ${activeTab === 'newCoins' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('newCoins')}
          >
            New Coins
          </button>
          <button 
            className={`px-4 py-2 rounded ${activeTab === 'mostValuable' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('mostValuable')}
          >
            Most Valuable
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default CreatorsPage;