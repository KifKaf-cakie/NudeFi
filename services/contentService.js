import { uploadToIPFS, getIPFSGatewayURL } from '../utils/ipfsUtils';
import { 
  createCoin,
  buyCoin,
  fetchCoinDetails,
  fetchTrendingCoins,
  fetchNewCoins,
  fetchMostValuableCoins
} from './zoraService';
import { parseEther, formatEther } from 'viem';
import axios from 'axios';

// Database interactions (replace with your actual DB implementation)
// For demo purposes, we'll use a simple in-memory store
const creatorCoinsStore = new Map();
const contentStore = new Map();

/**
 * Creates new content using Zora's Coins Protocol for the coin and our marketplace for NFTs
 * @param {Object} contentData - Content data to create
 * @param {string} account - Creator's wallet address
 * @returns {Promise<Object>} - Created content data
 */
export async function createContent(contentData, account) {
  try {
    // 1. Upload content file to IPFS
    const contentCid = await uploadContentToIPFS(contentData.file);
    
    // 2. Create and upload metadata to IPFS
    const metadataCid = await createAndUploadMetadata(contentData, contentCid);
    
    // 3. Check if creator already has a coin
    let creatorCoin = creatorCoinsStore.get(account);
    
    // 4. If no coin exists, create one using ZORA COINS SDK
    if (!creatorCoin) {
      // Create coin using Zora Coins SDK
      const coinParams = {
        name: contentData.coinName || `${contentData.title} Fan Token`,
        symbol: contentData.coinSymbol || contentData.title.substring(0, 5).toUpperCase(),
        uri: `ipfs://${metadataCid}`,
        payoutRecipient: account,
        initialPurchaseWei: parseEther('0.01') // Small initial purchase
      };
      
      const result = await createCoin(coinParams, account);
      creatorCoin = {
        address: result.address,
        symbol: coinParams.symbol,
        name: coinParams.name
      };
      
      // Save to our store
      creatorCoinsStore.set(account, creatorCoin);
      console.log(`Created new coin for creator: ${creatorCoin.address}`);
    }
    
    // 5. Register the content on the NudeFi marketplace contract
    const contentId = await registerContentWithMarketplace({
      uri: `ipfs://${metadataCid}`,
      price: contentData.price,
      isSubscription: contentData.isSubscription,
      subscriptionPrice: contentData.isSubscription ? contentData.subscriptionPrice : "0",
      contentType: contentData.contentType,
      coinAddress: creatorCoin.address,
      creator: account
    });
    
    // 6. Create content entry in our database
    const newContent = {
      id: contentId,
      title: contentData.title,
      description: contentData.description || "",
      creator: account,
      contentType: contentData.contentType,
      price: contentData.price,
      isSubscription: contentData.isSubscription,
      subscriptionPrice: contentData.isSubscription ? contentData.subscriptionPrice : 0,
      metadataUri: `ipfs://${metadataCid}`,
      contentUri: `ipfs://${contentCid}`,
      coinAddress: creatorCoin.address,
      coinSymbol: creatorCoin.symbol,
      mintCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending",
      previewUrl: getIPFSGatewayURL(contentCid)
    };
    
    // Save content to our store
    contentStore.set(contentId, newContent);
    
    return newContent;
  } catch (error) {
    console.error("Error creating content:", error);
    throw error;
  }
}

/**
 * Register content with the NudeFi marketplace smart contract
 * @param {Object} contentData - Content data
 * @returns {Promise<string>} - Content ID
 */
async function registerContentWithMarketplace(contentData) {
  try {
    // In a real implementation, this would call the smart contract
    // For demo purposes, generate a random ID
    return `content-${Date.now()}`;
  } catch (error) {
    console.error("Error registering content with marketplace:", error);
    throw error;
  }
}

/**
 * Mints content NFT for a buyer and handles coin trading through Zora SDK
 * @param {string} contentId - Content ID to mint
 * @param {string} price - Price in ETH
 * @param {string} account - Buyer's wallet address
 * @returns {Promise<Object>} - Transaction data
 */
export async function mintContent(contentId, price, account) {
  try {
    // Get the content
    const content = await getContentById(contentId);
    if (!content) {
      throw new Error("Content not found");
    }
    
    // 1. First mint the NFT through our marketplace contract
    const mintResult = await mintNFTFromMarketplace(contentId, price, account);
    
    // 2. Then optionally buy creator coins using Zora SDK (if user wants to subscribe)
    if (content.isSubscription) {
      // Calculate a suitable amount to buy
      const coinAmount = content.subscriptionPrice;
      
      // Buy coins using Zora SDK
      const buyParams = {
        coinAddress: content.coinAddress,
        amount: coinAmount.toString(),
        recipient: account
      };
      
      const buyResult = await buyCoin(buyParams, account);
      console.log("Bought creator coins:", buyResult);
    }
    
    // Update content mint count
    content.mintCount += 1;
    contentStore.set(contentId, content);
    
    return {
      txHash: mintResult.txHash,
      contentId,
      price,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error minting content:", error);
    throw error;
  }
}

/**
 * Mint NFT from the marketplace contract
 * @param {string} contentId - Content ID
 * @param {string} price - Price in ETH
 * @param {string} account - Buyer address
 * @returns {Promise<Object>} - Transaction result
 */
async function mintNFTFromMarketplace(contentId, price, account) {
  // In a real implementation, this would call the smart contract
  // For demo purposes, return a mock result
  return {
    txHash: `0x${Math.random().toString(36).substring(2, 15)}`,
    success: true
  };
}

/**
 * Get content by ID
 * @param {string} id - Content ID
 * @returns {Promise<Object|null>} - Content or null
 */
export async function getContentById(id) {
  const content = contentStore.get(id);
  if (!content) return null;
  
  // Get creator info (simplified for demo)
  return {
    ...content,
    creator: {
      address: content.creator,
      name: `Creator-${content.creator.substring(0, 6)}`,
      profileImage: null
    }
  };
}

/**
 * Fetches content created by a specific creator
 * @param {string} creatorAddress - Creator's wallet address
 * @returns {Promise<Array>} - Array of content items
 */
export async function fetchCreatorContent(creatorAddress) {
  // Filter content store for this creator's content
  const creatorContent = Array.from(contentStore.values())
    .filter(content => content.creator === creatorAddress);
  
  // If no stored content, return empty array
  if (creatorContent.length === 0) {
    // For demo purposes, create some mock content
    return Array(6).fill(0).map((_, i) => ({
      id: `content-${i}-${Date.now()}`,
      title: ["Private Dance", "Beach Whispers", "Midnight Confession", "Secret Desires", "Hidden Pleasures", "Intimate Moments"][i],
      description: "Exclusive adult content for premium subscribers.",
      creator: {
        address: creatorAddress,
        name: `Creator-${creatorAddress.substring(0, 6)}`,
        profileImage: "/mock/creator1.jpg"
      },
      contentType: ["image", "video", "image", "video", "audio", "image"][i % 6],
      previewUrl: `/mock/content-preview-${i}.jpg`,
      price: (0.01 + (i * 0.01)).toString(), // ETH
      isSubscription: i % 2 === 0,
      subscriptionPrice: (100 + (i * 50)).toString(), // Creator coins
      coinAddress: creatorCoinsStore.get(creatorAddress)?.address || "0x0000000000000000000000000000000000000000",
      coinSymbol: creatorCoinsStore.get(creatorAddress)?.symbol || "COIN",
      mintCount: Math.floor(Math.random() * 100),
      revenue: (Math.random() * 0.5).toFixed(3), // ETH
      engagement: Math.floor(70 + Math.random() * 30), // Percentage
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(), // Each one day earlier
      tags: ["exclusive", "premium", "adult", "creator"][i % 4],
      isNSFW: true
    }));
  }
  
  return creatorContent.map(content => ({
    ...content,
    creator: {
      address: content.creator,
      name: `Creator-${content.creator.substring(0, 6)}`,
      profileImage: "/mock/creator1.jpg"
    }
  }));
}

/**
 * Fetches creator's coin information
 * @param {string} creatorAddress - Creator's wallet address
 * @returns {Promise<Object>} - Coin data
 */
export async function fetchCreatorCoin(creatorAddress) {
  try {
    // Check if we have the coin in our store
    const storedCoin = creatorCoinsStore.get(creatorAddress);
    
    if (!storedCoin) {
      // If not in store, return mock data for demo purposes
      // In production, you would return null or fetch from blockchain
      return {
        address: "0xCa21d4228cDCc68D4e23807E5e370C07577Dd152",
        name: "Creator Token",
        symbol: "CREATE",
        totalSupply: "100000000",
        marketCap: "0.87",
        volume24h: "0.12",
        uniqueHolders: 27,
        activeHolders: 18,
        newHolders: 5,
        creatorEarnings: "0.34",
        proposalCount: 2,
        proposals: [
          {
            id: "proposal-1",
            title: "New Lingerie Photoshoot Theme",
            description: "Vote on the theme for my next lingerie photoshoot: Beach, Forest, or Studio?",
            creator: creatorAddress,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
            timeLeft: "2 days",
            yesVotes: 1200000,
            noVotes: 300000,
            yesPercentage: 80,
            noPercentage: 20,
            executed: false
          },
          {
            id: "proposal-2",
            title: "Exclusive Live Stream for Token Holders",
            description: "Should we organize a monthly exclusive live stream for token holders with at least 1000 tokens?",
            creator: creatorAddress,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            endTime: new Date(Date.now() + 86400000).toISOString(),
            timeLeft: "1 day",
            yesVotes: 900000,
            noVotes: 600000,
            yesPercentage: 60,
            noPercentage: 40,
            executed: false
          }
        ]
      };
    }
    
    // Fetch coin details from Zora API
    const coinDetails = await fetchCoinDetails(storedCoin.address);
    
    // If API fetch fails, return the stored coin with some defaults
    if (!coinDetails) {
      return {
        ...storedCoin,
        totalSupply: "100000000",
        marketCap: "0.05",
        volume24h: "0.01",
        uniqueHolders: 5,
        creatorEarnings: "0.02"
      };
    }
    
    // Return combined data
    return {
      address: coinDetails.address,
      name: coinDetails.name,
      symbol: coinDetails.symbol,
      totalSupply: coinDetails.totalSupply,
      marketCap: coinDetails.marketCap,
      volume24h: coinDetails.volume24h,
      uniqueHolders: coinDetails.uniqueHolders || 0,
      creatorEarnings: calculateCreatorEarnings(coinDetails),
      // Add other data needed for UI
      activeHolders: Math.floor(coinDetails.uniqueHolders * 0.7) || 0,
      newHolders: Math.floor(coinDetails.uniqueHolders * 0.2) || 0,
      proposalCount: 0 // Mock data since not provided by API
    };
  } catch (error) {
    console.error("Error fetching creator coin:", error);
    // Return minimal data to prevent UI errors
    return {
      address: creatorCoinsStore.get(creatorAddress)?.address || "0x0000000000000000000000000000000000000000",
      name: "Creator Token",
      symbol: "CREATE",
      totalSupply: "100000000",
      marketCap: "0.00",
      volume24h: "0.00",
      uniqueHolders: 0,
      creatorEarnings: "0.00"
    };
  }
}

/**
 * Fetches trending content based on various metrics
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Array>} - Array of trending content items
 */
export async function fetchTrendingContent(limit = 10) {
  try {
    // Use Zora SDK to fetch trending coins
    const trendingCoinsResult = await fetchTrendingCoins(limit);
    const trendingCoins = trendingCoinsResult?.edges?.map(edge => edge.node) || [];
    
    // If no trending coins, return mock data
    if (trendingCoins.length === 0) {
      return mockTrendingContent(limit);
    }
    
    // Transform coin data into content format
    return trendingCoins.map((coin, index) => ({
      id: `trending-${coin.address || index}`,
      title: coin.name || `Trending Content ${index + 1}`,
      contentType: determineContentType(coin),
      previewUrl: coin.media?.previewImage || `/mock/trending-${index % 5}.jpg`,
      price: estimatePriceFromMarketCap(coin.marketCap),
      creator: {
        address: coin.creatorAddress || `0x${index}${"0".repeat(40 - index.toString().length)}`,
        name: coin.creatorProfile || formatAddress(coin.creatorAddress),
        profileImage: coin.avatar?.previewImage || `/mock/creator-${index % 6}.jpg`
      },
      coinSymbol: coin.symbol || `COIN${index}`,
      coinAddress: coin.address,
      mintCount: coin.transfers?.count || Math.floor(50 + Math.random() * 200),
      trendScore: calculateTrendScore(coin),
      marketCap: coin.marketCap,
      volume24h: coin.volume24h,
      isNSFW: true
    }));
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return mockTrendingContent(limit);
  }
}

/**
 * Fetches trending creators based on coin performance
 * @param {number} limit - Number of creators to fetch
 * @returns {Promise<Array>} - Array of trending creators
 */
export async function fetchTrendingCreators(limit = 10) {
  try {
    // Use SDK to get coins by various metrics
    const [topGainers, mostValuable, newCoins] = await Promise.all([
      fetchTrendingCoins(limit),
      fetchMostValuableCoins(limit),
      fetchNewCoins(limit)
    ]);
    
    // Combine and deduplicate
    const allCoins = [
      ...(topGainers?.edges?.map(e => e.node) || []),
      ...(mostValuable?.edges?.map(e => e.node) || []),
      ...(newCoins?.edges?.map(e => e.node) || [])
    ];
    
    // Deduplicate by address
    const uniqueCoins = Array.from(
      new Map(allCoins.map(coin => [coin.address, coin])).values()
    ).slice(0, limit);
    
    // If no unique coins, return mock data
    if (uniqueCoins.length === 0) {
      return mockTrendingCreators(limit);
    }
    
    // Transform coin data into creator format
    return uniqueCoins.map((coin, index) => ({
      id: `creator-${index}`,
      address: coin.creatorAddress || `0x${index}${"0".repeat(40 - index.toString().length)}`,
      name: coin.creatorProfile || formatCreatorName(coin.name) || `Creator${index}`,
      profileImage: coin.avatar?.previewImage || `/mock/creator-${index % 6}.jpg`,
      bio: "Adult content creator specializing in intimate moments and exclusive experiences.",
      coinAddress: coin.address,
      coinSymbol: coin.symbol || `COIN${index}`,
      coinPrice: estimateCoinPrice(coin),
      marketCap: coin.marketCap || "0.1",
      growth24h: coin.marketCapDelta24h || "5.0",
      contentCount: 10 + Math.floor(Math.random() * 90),
      followers: coin.uniqueHolders || (100 + Math.floor(Math.random() * 9900))
    }));
  } catch (error) {
    console.error("Error fetching trending creators:", error);
    return mockTrendingCreators(limit);
  }
}

// Helper functions

/**
 * Upload content to IPFS
 * @param {File} file - File to upload
 * @returns {Promise<string>} - IPFS CID
 */
async function uploadContentToIPFS(file) {
  // In a real implementation, this would upload to IPFS
  // For demo purposes, return a mock CID
  return `bafybeigoxzqzbnxsn35vq7lls3ljxdcwjafxvbvkivprsodzrptpigu${Date.now()}`;
}

/**
 * Create metadata and upload to IPFS
 * @param {Object} contentData - Content data
 * @param {string} contentCid - Content IPFS CID
 * @returns {Promise<string>} - Metadata IPFS CID
 */
async function createAndUploadMetadata(contentData, contentCid) {
  // Construct metadata object
  const metadata = {
    name: contentData.title,
    description: contentData.description || "",
    image: `ipfs://${contentCid}`,
    properties: {
      creator: contentData.creator,
      contentType: contentData.contentType,
      price: contentData.price.toString(),
      isSubscription: contentData.isSubscription,
      tags: contentData.tags || []
    }
  };
  
  // Add content specific properties
  if (contentData.isSubscription) {
    metadata.properties.subscriptionPrice = contentData.subscriptionPrice.toString();
  }
  
  // Add animation_url for video and audio
  if (contentData.contentType === 'video' || contentData.contentType === 'audio') {
    metadata.animation_url = `ipfs://${contentCid}`;
  }
  
  // In a real implementation, this would upload to IPFS
  // For demo purposes, return a mock CID
  return `bafkreihz5knnvvsvmaxlpw3kout23te6yboquyvvs72wzfulgrkwj7r${Date.now()}`;
}

/**
 * Calculate creator earnings from coin data
 * @param {Object} coinData - Coin data
 * @returns {string} - Creator earnings
 */
function calculateCreatorEarnings(coinData) {
  if (!coinData.creatorEarnings || !Array.isArray(coinData.creatorEarnings)) {
    return "0.00";
  }
  
  const total = coinData.creatorEarnings.reduce((sum, earning) => {
    if (earning && earning.amount && earning.amount.amountDecimal) {
      return sum + earning.amount.amountDecimal;
    }
    return sum;
  }, 0);
  
  return total.toFixed(2);
}

/**
 * Determine content type from coin data
 * @param {Object} coin - Coin data
 * @returns {string} - Content type
 */
function determineContentType(coin) {
  // In a real implementation, we would determine from metadata
  // For demo, randomly select
  const types = ['image', 'video', 'audio'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Format address for display
 * @param {string} address - Wallet address
 * @returns {string} - Formatted address
 */
function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Extract creator name from coin name
 * @param {string} coinName - Coin name
 * @returns {string} - Creator name
 */
function formatCreatorName(coinName) {
  if (!coinName) return '';
  
  // Remove common suffixes
  const nameParts = coinName.split(/\s+/);
  if (nameParts.length > 1) {
    // If the last part is a common suffix, remove it
    const lastPart = nameParts[nameParts.length - 1].toLowerCase();
    if (['coin', 'token', 'fan', 'nft', 'creator'].includes(lastPart)) {
      return nameParts.slice(0, -1).join(' ');
    }
  }
  
  return coinName;
}

/**
 * Estimate price from market cap
 * @param {string} marketCap - Market cap in ETH
 * @returns {string} - Estimated price
 */
function estimatePriceFromMarketCap(marketCap) {
  if (!marketCap) return "0.01";
  
  const mcValue = parseFloat(marketCap);
  // Simple calculation: price is roughly marketCap / 100
  const price = Math.max(0.01, mcValue / 100);
  return price.toFixed(2);
}

/**
 * Estimate coin price
 * @param {Object} coin - Coin data
 * @returns {string} - Estimated coin price
 */
function estimateCoinPrice(coin) {
  if (!coin.marketCap || !coin.totalSupply) {
    return (0.0001 + (Math.random() * 0.001)).toFixed(6);
  }
  
  const marketCap = parseFloat(coin.marketCap);
  const totalSupply = parseFloat(coin.totalSupply);
  
  if (isNaN(marketCap) || isNaN(totalSupply) || totalSupply === 0) {
    return (0.0001 + (Math.random() * 0.001)).toFixed(6);
  }
  
  return (marketCap / totalSupply).toFixed(6);
}

/**
 * Calculate trend score
 * @param {Object} coin - Coin data
 * @returns {number} - Trend score
 */
function calculateTrendScore(coin) {
  // Calculate trend score based on market metrics
  let score = 50; // Base score
  
  // Add points for market cap growth
  if (coin.marketCapDelta24h) {
    const growth = parseFloat(coin.marketCapDelta24h);
    if (!isNaN(growth)) {
      score += growth * 5; // 5 points per % growth
    }
  }
  
  // Add points for volume
  if (coin.volume24h) {
    const volume = parseFloat(coin.volume24h);
    if (!isNaN(volume)) {
      score += Math.min(volume * 2, 30); // Up to 30 points for volume
    }
  }
  
  // Add points for unique holders
  if (coin.uniqueHolders) {
    score += Math.min(coin.uniqueHolders / 10, 20); // Up to 20 points for holders
  }
  
  return Math.min(Math.max(Math.round(score), 0), 100); // Ensure score is between 0-100
}

// Mock data generators for fallback

function mockTrendingContent(limit) {
  return Array(limit).fill(0).map((_, i) => ({
    id: `trending-${i}`,
    title: ["Private Moments", "Beach Fantasy", "Midnight Special", "Roleplay Adventures", "ASMR Session", "Behind the Scenes"][i % 6],
    contentType: ["image", "video", "video", "image", "audio", "video"][i % 6],
    previewUrl: `/mock/trending-${i % 5}.jpg`,
    price: (0.02 + (i * 0.01)).toFixed(2),
    creator: {
      address: `0x${i}${"0".repeat(40 - i.toString().length)}`,
      name: ["SexyCreator", "IntimateArtist", "WhisperQueen", "FantasyMaker", "DesireArtist", "BeachLover"][i % 6],
      profileImage: `/mock/creator-${i % 6}.jpg`
    },
    coinSymbol: ["SEXY", "INTIM", "WHISP", "FANT", "DESIRE", "BEACH"][i % 6],
    mintCount: 50 + Math.floor(Math.random() * 200),
    trendScore: 95 - i * 5,
    isNSFW: true
  }));
}

function mockTrendingCreators(limit) {
  return Array(limit).fill(0).map((_, i) => ({
    id: `creator-${i}`,
    address: `0x${i}${"0".repeat(40 - i.toString().length)}`,
    name: ["SexyCreator", "IntimateArtist", "WhisperQueen", "FantasyMaker", "DesireArtist", "BeachLover"][i % 6],
    profileImage: `/mock/creator-${i % 6}.jpg`,
    bio: "Adult content creator specializing in intimate moments and exclusive experiences.",
    coinAddress: `0x${(i + 100)}${"0".repeat(40 - (i + 100).toString().length)}`,
    coinSymbol: ["SEXY", "INTIM", "WHISP", "FANT", "DESIRE", "BEACH"][i % 6],
    coinPrice: (0.0001 + (Math.random() * 0.001)).toFixed(6),
    marketCap: (0.1 + (Math.random() * 2)).toFixed(2),
    growth24h: (5 + (Math.random() * 20)).toFixed(1),
    contentCount: 10 + Math.floor(Math.random() * 90),
    followers: 100 + Math.floor(Math.random() * 9900)
  }));
}
