import React, { useState, useEffect } from "react";
import { Heart, Lock, DollarSign, BarChart2, TrendingUp, Gift } from "lucide-react";

export default function EnhancedNudeFiLanding() {
  const [activeCreator, setActiveCreator] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto rotate featured content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // Auto rotate trending creators
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCreator((prev) => (prev + 1) % trendingCreators.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for featured content
  const featuredContent = [
    {
      id: 1,
      title: "Midnight Temptation",
      creator: "SensualWhisper",
      coinSymbol: "WHISP",
      contentType: "photo",
      price: "0.05",
      mintCount: 127,
      trendScore: 96,
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%23160c27'/><path d='M250,150 C250,80 350,80 350,150 C350,200 300,220 300,250 M300,280 L300,280' stroke='%23ec4899' stroke-width='4' fill='none'/><circle cx='240' cy='180' r='20' fill='%23ec4899' fill-opacity='0.3'/><circle cx='360' cy='180' r='20' fill='%23ec4899' fill-opacity='0.3'/><path d='M220,230 C260,260 340,260 380,230' stroke='%23ec4899' stroke-width='4' fill='none'/></svg>"
    },
    {
      id: 2,
      title: "Private Desires",
      creator: "ExoticBeauty",
      coinSymbol: "EXOT",
      contentType: "video",
      price: "0.08",
      mintCount: 89,
      trendScore: 92,
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='600' height='400' fill='%231a0b25'/><rect x='150' y='100' width='300' height='200' rx='20' fill='%23370b4f' fill-opacity='0.6'/><circle cx='300' cy='200' r='50' stroke='%23ec4899' stroke-width='8' fill='none'/><polygon points='290,170 290,230 340,200' fill='%23ec4899'/></svg>"
    },
    {
      id: 3,
      title: "Whispers in Lace",
      creator: "LaceGoddess",
      coinSymbol: "LACE",
      contentType: "photo",
      price: "0.06",
      mintCount: 115,
      trendScore: 94,
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><defs><pattern id='lace' patternUnits='userSpaceOnUse' width='20' height='20'><path d='M0,10 L20,10 M10,0 L10,20' stroke='%23ec4899' stroke-width='1' stroke-opacity='0.3'/></pattern></defs><rect width='600' height='400' fill='%23160c20'/><rect x='100' y='50' width='400' height='300' rx='15' fill='url(%23lace)'/><path d='M300,150 Q400,100 450,200 Q400,300 300,250 Q200,300 150,200 Q200,100 300,150 Z' fill='%23570d47' fill-opacity='0.5' stroke='%23ec4899' stroke-width='2' stroke-opacity='0.6'/></svg>"
    }
  ];

  // Mock data for trending creators
  const trendingCreators = [
    {
      id: 1,
      name: "SensualWhisper",
      coinSymbol: "WHISP",
      profileImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='85' r='60' fill='%23570d47'/><path d='M100,160 C130,160 150,175 170,205 C120,220 80,220 30,205 C50,175 70,160 100,160 Z' fill='%23570d47'/><circle cx='80' cy='75' r='5' fill='white'/><circle cx='120' cy='75' r='5' fill='white'/><path d='M85,95 C95,105 105,105 115,95' stroke='white' stroke-width='2' fill='none'/></svg>",
      marketCap: "1.24",
      growth24h: "+15.7%",
      followers: "4.2K",
      monthlyEarnings: "3.2"
    },
    {
      id: 2,
      name: "ExoticBeauty",
      coinSymbol: "EXOT",
      profileImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='85' r='60' fill='%239146FF'/><path d='M100,160 C130,160 150,175 170,205 C120,220 80,220 30,205 C50,175 70,160 100,160 Z' fill='%239146FF'/><circle cx='80' cy='75' r='5' fill='white'/><circle cx='120' cy='75' r='5' fill='white'/><path d='M70,92 C85,110 115,110 130,92' stroke='white' stroke-width='2' fill='none'/></svg>",
      marketCap: "0.96",
      growth24h: "+12.3%",
      followers: "3.7K",
      monthlyEarnings: "2.7"
    },
    {
      id: 3,
      name: "LaceGoddess",
      coinSymbol: "LACE",
      profileImage: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='85' r='60' fill='%23FF6B81'/><path d='M100,160 C130,160 150,175 170,205 C120,220 80,220 30,205 C50,175 70,160 100,160 Z' fill='%23FF6B81'/><circle cx='80' cy='75' r='5' fill='white'/><circle cx='120' cy='75' r='5' fill='white'/><path d='M80,100 C90,95 110,95 120,100' stroke='white' stroke-width='2' fill='none'/></svg>",
      marketCap: "0.87",
      growth24h: "+18.5%",
      followers: "2.9K",
      monthlyEarnings: "2.4"
    }
  ];

  // AI trend predictions
  const trendPredictions = [
    {
      title: "Intimate ASMR Content",
      description: "Sensual whispers and intimate sounds are trending with 62% higher engagement.",
      confidence: 94,
      growthPotential: 3.2,
      recommendedTags: ["asmr", "whisper", "intimate", "sensual"]
    },
    {
      title: "Lingerie Roleplay",
      description: "Lingerie-themed roleplays showing 4.5x higher token velocity and retention.",
      confidence: 89,
      growthPotential: 4.5,
      recommendedTags: ["lingerie", "roleplay", "fantasy", "lace"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      {/* Animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 pt-8 pb-24">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Nude</span>
            <span className="text-3xl font-bold text-white">Fi</span>
            <span className="ml-1 text-2xl">💋</span>
          </div>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105">
            Connect Wallet
          </button>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="relative">
              Desire 
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-pink-500 rounded opacity-70"></span>
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Tokenized
            </span>
          </h1>
          <p className="text-xl mb-10 text-gray-300">
            The first adult content platform where creators and fans build intimate communities through tokenized connections
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg shadow-pink-500/30 transform transition hover:scale-105 animate-pulse">
              Explore Content
            </button>
            <button className="bg-black/30 backdrop-blur-sm border border-pink-500/30 hover:border-pink-500/50 text-white font-bold px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
              Discover Creators
            </button>
          </div>
        </div>
      </header>

      {/* Featured Content Slider */}
      <section className="relative z-10 py-16 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Featured</span> Content
          </h2>
          <div className="relative max-w-4xl mx-auto h-96 overflow-hidden rounded-2xl shadow-2xl">
            {featuredContent.map((item, index) => (
              <div 
                key={item.id}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-300 mb-4">By @{item.creator}</p>
                      <div className="flex items-center space-x-4">
                        <span className="bg-pink-600/80 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {item.contentType.toUpperCase()}
                        </span>
                        <span className="flex items-center">
                          <Heart size={16} className="text-pink-500 mr-1" />
                          {item.mintCount}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp size={16} className="text-green-500 mr-1" />
                          {item.trendScore}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold">{item.price} ETH</span>
                      <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg shadow-pink-500/20 transition-all hover:scale-105">
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-pink-500 w-6' : 'bg-white/50'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Exclusive</span> Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6 group-hover:from-pink-600/40 group-hover:to-purple-600/40 transition-all duration-300">
                <Lock size={24} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exclusive Privacy</h3>
              <p className="text-gray-300">Your intimate content secured on the blockchain with our advanced privacy controls.</p>
            </div>
            <div className="group bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6 group-hover:from-pink-600/40 group-hover:to-purple-600/40 transition-all duration-300">
                <DollarSign size={24} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Earnings</h3>
              <p className="text-gray-300">Earn from both direct sales and ongoing token trading with our royalty system.</p>
            </div>
            <div className="group bg-black/20 backdrop-blur-md p-8 rounded-2xl border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6 group-hover:from-pink-600/40 group-hover:to-purple-600/40 transition-all duration-300">
                <Gift size={24} className="text-pink-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exclusive Access</h3>
              <p className="text-gray-300">Token holders gain privileged access to premium content and private experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Creators */}
      <section className="relative z-10 py-20 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Trending</span> Creators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-gray-800/80 to-black/80 backdrop-blur-md p-6 rounded-2xl border border-pink-500/20 h-full flex flex-col justify-center">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 ring-2 ring-pink-500/50">
                    <img 
                      src={trendingCreators[activeCreator].profileImage} 
                      alt={trendingCreators[activeCreator].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{trendingCreators[activeCreator].name}</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-pink-400 mr-1">$</span>
                      <span className="text-sm text-gray-300">{trendingCreators[activeCreator].coinSymbol}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/40 p-4 rounded-lg border border-pink-500/10">
                    <p className="text-gray-400 text-xs mb-1">Market Cap</p>
                    <p className="text-xl font-bold">{trendingCreators[activeCreator].marketCap} ETH</p>
                    <p className="text-green-500 text-sm">{trendingCreators[activeCreator].growth24h}</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-pink-500/10">
                    <p className="text-gray-400 text-xs mb-1">Followers</p>
                    <p className="text-xl font-bold">{trendingCreators[activeCreator].followers}</p>
                    <p className="text-green-500 text-sm">+{Math.floor(Math.random() * 100)} today</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-1">Monthly Creator Earnings</p>
                  <p className="text-2xl font-bold text-pink-500">{trendingCreators[activeCreator].monthlyEarnings} ETH</p>
                </div>
                
                <div className="flex space-x-4">
                  <button className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-white text-center py-2 rounded-lg border border-pink-500/10 hover:border-pink-500/30 transition-colors">
                    View Profile
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition-all">
                    Buy Token
                  </button>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="relative z-10 rounded-2xl overflow-hidden transform rotate-3 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70"></div>
                  <img 
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'><rect width='600' height='800' fill='%230f0518'/><circle cx='300' cy='220' r='180' fill='%23570d47' fill-opacity='0.8'/><path d='M300,520 C420,520 480,620 520,800 C350,840 250,840 80,800 C120,620 180,520 300,520 Z' fill='%23570d47' fill-opacity='0.8'/><circle cx='240' cy='180' r='15' fill='white' fill-opacity='0.8'/><circle cx='360' cy='180' r='15' fill='white' fill-opacity='0.8'/><path d='M240,300 C270,330 330,330 360,300' stroke='white' stroke-width='6' fill='none'/><circle cx='300' cy='500' r='40' fill='%23ec4899' fill-opacity='0.3'/></svg>"
                    alt="Creator Illustration"
                    className="w-full h-auto"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl border border-pink-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-bold">Creator Economy</h4>
                        <div className="flex items-center">
                          <BarChart2 size={16} className="text-pink-500 mr-1" />
                          <span className="text-sm">Stats</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">Top creators earn up to 4.5 ETH monthly through content sales and token trading.</p>
                      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 z-0 w-full h-full bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-2xl transform -rotate-3"></div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {trendingCreators.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCreator(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === activeCreator ? 'bg-pink-500 w-6' : 'bg-white/50'}`}
                  aria-label={`View creator ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Trend Predictions */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">AI-Powered</span> Trend Predictions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {trendPredictions.map((prediction, index) => (
              <div key={index} className="bg-gradient-to-br from-black/80 to-purple-900/20 backdrop-blur-md p-6 rounded-2xl border border-pink-500/20 hover:border-pink-500/40 transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-pink-600/5 rounded-full -mr-20 -mt-20 group-hover:bg-pink-600/10 transition-colors"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-pink-400">{prediction.title}</h3>
                  <p className="text-gray-300 mb-4">{prediction.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prediction.recommendedTags.map((tag, idx) => (
                      <span key={idx} className="bg-black/30 text-pink-300 text-xs px-3 py-1 rounded-full border border-pink-500/30">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 text-green-400">+{prediction.growthPotential}x</div>
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400" 
                          style={{ width: `${prediction.growthPotential * 20}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <span className="bg-pink-500/20 text-pink-400 text-xs font-medium px-2 py-1 rounded-full">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 mb-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl p-10 border border-pink-500/30 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-600/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="text-pink-500 text-lg font-medium">Are you ready?</span>
              <h2 className="text-4xl font-bold mt-2 mb-6">Start Your Adult Content Empire Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Create your first NFT, launch your creator coin, and start building your community of devoted fans.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-3 rounded-lg shadow-lg shadow-pink-500/20 transform transition hover:scale-105 animate-pulse">
                  Connect Wallet to Start
                </button>
                <button className="bg-black/50 backdrop-blur-sm text-white border border-pink-500/30 hover:border-pink-500/70 font-bold text-lg px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105">
                  Explore Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
