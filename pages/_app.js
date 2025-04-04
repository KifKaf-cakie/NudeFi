import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useState, useEffect } from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { base } from 'viem/chains';
import { setApiKey } from '@zoralabs/coins-sdk';
import '../styles/globals.css';

// Configure wagmi client
const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: "NudeFi",
    appDescription: "Adult content NFT platform powered by Zora's Coins Protocol",
    appUrl: "https://nudefi.xyz",
    
    // ConnectKit options
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    
    // Configure chains - we're using Base
    chains: [base],
  })
);

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);
  
  // Set up Zora API key
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ZORA_API_KEY) {
      setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);
    }
  }, []);
  
  // Fix hydration issues - only render after client-side
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider 
        theme="midnight"
        customTheme={{
          "--ck-connectbutton-background": "#db2777",
          "--ck-connectbutton-hover-background": "#be185d",
          "--ck-primary-button-background": "#db2777",
          "--ck-primary-button-hover-background": "#be185d",
        }}
      >
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
