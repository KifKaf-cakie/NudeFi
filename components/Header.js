import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

export default function Header() {
  const { isConnected } = useAccount()
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
        isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center group">
              <span className="text-pink-500 text-3xl font-bold mr-1 group-hover:text-pink-400 transition-colors">Nude</span>
              <span className="text-white text-3xl font-bold group-hover:text-gray-200 transition-colors">Fi</span>
              <span className="text-pink-500 ml-1 group-hover:scale-110 transition-transform">💋</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" legacyBehavior>
              <a className={`text-lg relative ${router.pathname === '/explore' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'} 
                after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-pink-500 
                after:transition-all hover:after:w-full ${router.pathname === '/explore' ? 'after:w-full' : ''}`}>
                Explore
              </a>
            </Link>
            <Link href="/market" legacyBehavior>
              <a className={`text-lg relative ${router.pathname === '/market' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}
                after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-pink-500 
                after:transition-all hover:after:w-full ${router.pathname === '/market' ? 'after:w-full' : ''}`}>
                Market
              </a>
            </Link>
            <Link href="/creators" legacyBehavior>
              <a className={`text-lg relative ${router.pathname === '/creators' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}
                after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-pink-500 
                after:transition-all hover:after:w-full ${router.pathname === '/creators' ? 'after:w-full' : ''}`}>
                Creators
              </a>
            </Link>
            {isConnected && (
              <Link href="/dashboard" legacyBehavior>
                <a className={`text-lg relative ${router.pathname === '/dashboard' ? 'text-pink-500 font-bold' : 'text-gray-300 hover:text-white'}
                  after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:h-[2px] after:w-0 after:bg-pink-500 
                  after:transition-all hover:after:w-full ${router.pathname === '/dashboard' ? 'after:w-full' : ''}`}>
                  Dashboard
                </a>
              </Link>
            )}
          </nav>
          
          {/* Wallet Connection */}
     <div className="flex items-center">
       <ConnectKitButton />
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
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm shadow-lg border-t border-pink-500/20">
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
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
