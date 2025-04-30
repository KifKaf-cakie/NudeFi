/**
 * This script prepares the project for deployment on Vercel
 * It ensures all necessary configuration files are properly set up
 */
const fs = require('fs');
const path = require('path');

function prepareVercelDeployment() {
  console.log("Preparing project for Vercel deployment...");
  
  // 1. Ensure the config directory exists
  const configDir = path.join(__dirname, "../config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
    console.log("Created config directory");
  }
  
  // 2. Check if chains.js exists, if not create it
  const chainsConfigPath = path.join(configDir, "chains.js");
  if (!fs.existsSync(chainsConfigPath)) {
    // Create the chains.js file with Base Sepolia configuration
    const chainsConfig = `// config/chains.js
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
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || "",
    governance: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || ""
  }
};

// Defaults for the application
export const APP_CONFIG = {
  // Platform referrer - make sure to update this with your wallet address
  platformReferrer: process.env.NEXT_PUBLIC_PLATFORM_REFERRER || "0xYourWalletAddressHere",
  
  // IPFS gateway
  ipfsGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || "https://ipfs.io/ipfs/",
  
  // Default file size limits
  maxFileSize: 100 * 1024 * 1024, // 100MB
  
  // Supported file types
  supportedFileTypes: {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }
};`;

    fs.writeFileSync(chainsConfigPath, chainsConfig);
    console.log("Created chains.js configuration file");
  } else {
    console.log("chains.js configuration file already exists");
  }
  
  // 3. Create vercel.json if it doesn't exist
  const vercelConfigPath = path.join(__dirname, "../vercel.json");
  if (!fs.existsSync(vercelConfigPath)) {
    // Create the vercel.json file with optimized settings
    const vercelConfig = `{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "devCommand": "next dev",
  "outputDirectory": ".next",
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview": true,
      "production": true
    }
  },
  "env": {
    "NEXT_PUBLIC_BASE_RPC_URL": "https://sepolia.base.org"
  }
}`;

    fs.writeFileSync(vercelConfigPath, vercelConfig);
    console.log("Created vercel.json configuration file");
  } else {
    console.log("vercel.json configuration file already exists");
  }
  
  // 4. Create a next.config.js if it doesn't exist
  const nextConfigPath = path.join(__dirname, "../next.config.js");
  if (!fs.existsSync(nextConfigPath)) {
    // Create next.config.js with Base Sepolia settings
    const nextConfig = `/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'infura-ipfs.io', 'gateway.pinata.cloud'],
  },
  env: {
    NEXT_PUBLIC_BASE_RPC_URL: 'https://sepolia.base.org',
    NEXT_PUBLIC_CHAIN_ID: '84532',
  },
  // To reduce build size by excluding large TensorFlow models in production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error:
      // https://github.com/vercel/next.js/issues/36085
      config.resolve.fallback = { fs: false, net: false, tls: false }
    }
    return config
  },
}`;

    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log("Created next.config.js file");
  } else {
    console.log("next.config.js file already exists");
  }
  
  // 5. Update .gitignore to exclude certain files
  const gitignorePath = path.join(__dirname, "../.gitignore");
  if (fs.existsSync(gitignorePath)) {
    let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    
    // Make sure deployments directory is not ignored for Vercel
    if (gitignoreContent.includes('/deployments')) {
      gitignoreContent = gitignoreContent.replace('/deployments', '');
      gitignoreContent += '\n# Include deployment files for Vercel\n!deployments/*.json\n';
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log("Updated .gitignore to include deployment files");
    }
  }
  
  console.log("Project preparation for Vercel deployment complete!");
  console.log("Next steps:");
  console.log("1. Deploy your contracts to Base Sepolia using: npm run contracts:deploy:sepolia");
  console.log("2. Update the environment variables on Vercel with your contract addresses");
  console.log("3. Push your code to GitHub and connect to Vercel for deployment");
}

// Run the preparation
prepareVercelDeployment();
