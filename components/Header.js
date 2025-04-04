import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header({ isConnected, address, connect, disconnect }) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center">
              <span className="text-pink-500 text-3xl font-bold mr-1">Nude</span>
              <span className="text-white text-3xl font-bold">Fi</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" legacyBehavior>
              <a className={`text-lg ${router.pathname === '/explore' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}`}>
                Explore
              </a>
            </Link>
            <Link href="/market" legacyBehavior>
              <a className={`text-lg ${router.pathname === '/market' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}`}>
                Market
              </a>
            </Link>
            <Link href="/creators" legacyBehavior>
              <a className={`text-lg ${router.pathname === '/creators' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}`}>
                Creators
              </a>
            </Link>
            {isConnected && (
              <Link href="/dashboard" legacyBehavior>
                <a className={`text-lg ${router.pathname === '/dashboard' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}`}>
                  Dashboard
                </a>
              </Link>
            )}
          </nav>
          
          {/* Wallet Connection */}
          <div className="flex items-center">
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" legacyBehavior>
                  <a className="flex items-center bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-2">
                    <span className="text-white mr-2">{formatAddress(address)}</span>
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {address?.substring(2, 4).toUpperCase()}
                      </span>
                    </div>
                  </a>
                </Link>
                <button 
                  onClick={disconnect}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hidden lg:block"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={connect}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-lg"
              >
                Connect Wallet
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="ml-4 text-white md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/explore" legacyBehavior>
                <a 
                  className={`text-lg py-2 ${router.pathname === '/explore' ? 'text-pink-500 font-bold' : 'text-gray-300'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Explore
                </a>
              </Link>
              <Link href="/market" legacyBehavior>
                <a 
                  className={`text-lg py-2 ${router.pathname === '/market' ? 'text-pink-500 font-bold' : 'text-gray-300'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Market
                </a>
              </Link>
              <Link href="/creators" legacyBehavior>
                <a 
                  className={`text-lg py-2 ${router.pathname === '/creators' ? 'text-pink-500 font-bold' : 'text-gray-300'}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  Creators
                </a>
              </Link>
              {isConnected && (
                <Link href="/dashboard" legacyBehavior>
                  <a 
                    className={`text-lg py-2 ${router.pathname === '/dashboard' ? 'text-pink-500 font-bold' : 'text-gray-300'}`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </a>
                </Link>
              )}
              {isConnected && (
                <button 
                  onClick={() => {
                    disconnect();
                    setShowMobileMenu(false);
                  }}
                  className="text-left text-lg py-2 text-gray-300"
                >
                  Disconnect
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
