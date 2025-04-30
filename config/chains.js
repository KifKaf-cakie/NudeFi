import { baseSepolia } from 'viem/chains';

// Base Sepolia testnet configuration
export const CHAIN_CONFIG = {
  // Chain details
  chainId: baseSepolia.id, // 84532
  name: baseSepolia.name,
  
  // Contract addresses
  zoraFactoryAddress: "0x777777751622c0d3258f214F9DF38E35BF45baF3", // Same on Sepolia
  
  // RPC URLs
  rpcUrl: "https://sepolia.base.org",
  websocketUrl: "wss://sepolia.base.org",
  
  // Block explorer
  blockExplorer: "https://sepolia.basescan.org",
  
  // NudeFi contract addresses (to be updated after deployment)
  contracts: {
    marketplace: "",
    governance: ""
  }
};

// Defaults for the application
export const APP_CONFIG = {
  // Platform referrer - make sure to update this with your wallet address
  platformReferrer: "0xYourWalletAddressHere",
  
  // IPFS gateway
  ipfsGateway: "https://ipfs.io/ipfs/",
  
  // Default file size limits
  maxFileSize: 100 * 1024 * 1024, // 100MB
  
  // Supported file types
  supportedFileTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
};
