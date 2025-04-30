/**
 * This script sets up a local development environment for testing
 * It uses mock data instead of relying on actual blockchain interactions
 */
const fs = require('fs');
const path = require('path');

// Mock contract addresses for local testing
const MOCK_CONTRACTS = {
  marketplace: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  governance: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  zoraFactory: "0x777777751622c0d3258f214F9DF38E35BF45baF3"
};

// Generate mock deployment files
function setupLocalDev() {
  console.log("Setting up local development environment...");
  
  // Create deployments directory if it doesn't exist
  const deploymentDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }
  
  // Create a mock deployment file
  const deploymentInfo = {
    network: "local",
    marketplace: {
      address: MOCK_CONTRACTS.marketplace,
      version: "1.0.0",
    },
    governance: {
      address: MOCK_CONTRACTS.governance,
      version: "1.0.0",
    },
    zoraFactory: MOCK_CONTRACTS.zoraFactory,
    deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Default hardhat account
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(deploymentDir, `local-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Created mock deployment file for local testing");
  
  // Update chains config with mock contract addresses
  try {
    const chainConfigPath = path.join(__dirname, "../config/chains.js");
    if (fs.existsSync(chainConfigPath)) {
      let chainConfigContent = fs.readFileSync(chainConfigPath, 'utf8');
      
      // Update the contract addresses
      chainConfigContent = chainConfigContent.replace(
        /marketplace: ".*"/,
        `marketplace: "${MOCK_CONTRACTS.marketplace}"`
      );
      chainConfigContent = chainConfigContent.replace(
        /governance: ".*"/,
        `governance: "${MOCK_CONTRACTS.governance}"`
      );
      
      fs.writeFileSync(chainConfigPath, chainConfigContent);
      console.log("Updated config/chains.js with mock contract addresses");
    } else {
      console.log("Chain config file not found. Creating a local version...");
      
      const localChainConfig = `
// config/chains.js - Local Development Version
import { hardhat } from 'viem/chains';

// Local development configuration
export const CHAIN_CONFIG = {
  // Chain details
  chainId: 31337, // Hardhat local chain ID
  name: "Local Hardhat",
  
  // Contract addresses
  zoraFactoryAddress: "${MOCK_CONTRACTS.zoraFactory}", // Mock Zora factory
  
  // RPC URLs
  rpcUrl: "http://localhost:8545",
  websocketUrl: "ws://localhost:8545",
  
  // NudeFi contract addresses
  contracts: {
    marketplace: "${MOCK_CONTRACTS.marketplace}",
    governance: "${MOCK_CONTRACTS.governance}"
  }
};

// Defaults for the application
export const APP_CONFIG = {
  // Platform referrer
  platformReferrer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Default hardhat account
  
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
};`;
      
      fs.writeFileSync(path.join(__dirname, "../config/chains.local.js"), localChainConfig);
      console.log("Created local chain config file: config/chains.local.js");
    }
  } catch (error) {
    console.error("Error updating config files:", error);
  }
  
  console.log("Local development setup complete!");
}

// Run the setup
setupLocalDev();
