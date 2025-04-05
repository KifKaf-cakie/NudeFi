import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from '@wagmi/connectors';

export default function EnhancedLandingPage() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  const [activeCreator, setActiveCreator] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const creatorInterval = setInterval(() => {
      setActiveCreator((prev) => (prev + 1) % trendingCreators.length);
    }, 4000);
    return () => clearInterval(creatorInterval);
  }, []);

  const featuredContent = [
    {
      id: 1,
      title: 'Midnight Temptation',
      creator: 'SensualWhisper',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 2,
      title: 'Private Desires',
      creator: 'ExoticBeauty',
      image: 'https://via.placeholder.com/800x400',
    },
    {
      id: 3,
      title: 'Whispers in Lace',
      creator: 'LaceGoddess',
      image: 'https://via.placeholder.com/800x400',
    },
  ];

  const trendingCreators = [
    { id: 1, name: 'SensualWhisper' },
    { id: 2, name: 'ExoticBeauty' },
    { id: 3, name: 'LaceGoddess' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>NudeFi - Tokenized Desire</title>
      </Head>

      <header className="p-6 flex justify-between items-center">
        <div className="text-3xl font-bold text-pink-500">NudeFi 💋</div>
        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="bg-pink-600 px-4 py-2 rounded"
          >
            Disconnect ({address?.slice(0, 6)}...{address?.slice(-4)})
          </button>
        ) : (
          <button
            onClick={() => connect()}
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main className="px-4">
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Desire
            </span>{' '}
            Tokenized
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Build intimate communities powered by NFTs and creator coins.
          </p>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Content</h2>
          <div className="relative h-64 bg-black rounded-xl overflow-hidden">
            {featuredContent.map((item, index) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
                className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Trending Creators</h2>
          <div className="text-center text-xl">
            {trendingCreators[activeCreator].name}
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-gray-500 border-t border-gray-700">
        © 2025 NudeFi. All rights reserved.
      </footer>
    </div>
  );
}
