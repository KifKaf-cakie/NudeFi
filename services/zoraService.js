import { 
  createCoin as createCoinSDK, 
  tradeCoin, 
  updateCoinURI, 
  getCoin, 
  getCoins, 
  getCoinComments, 
  getCoinsTopGainers,
  getCoinsTopVolume24h,
  getCoinsMostValuable,
  getCoinsNew,
  getProfile,
  getProfileBalances,
  simulateBuy,
} from '@zoralabs/coins-sdk';
import { parseEther } from 'viem';
import { getWalletClient, getPublicClient } from '../utils/clientUtils';
import { CHAIN_CONFIG } from '../config/chains';

// Base Sepolia Chain ID
const CHAIN_ID = 84532;

export async function simulateSell(params) {
  try {
    console.log("Simulating sell", params);
    return {
      amountOut: params.tokenAmount * BigInt(90) / BigInt(100),
      orderSize: params.tokenAmount
    };
  } catch (error) {
    console.error("Sell simulation error:", error);
    throw error;
  }
}

/**
 * Creates a coin for a creator using Zora Coins Protocol
 * @param {Object} params - Coin creation parameters
 * @param {string} account - Creator's wallet address
 * @returns {Promise<Object>} - Created coin data
 */
export async function createCreatorCoin(params, account) {
  try {
    const walletClient = await getWalletClient(account);
    const publicClient = getPublicClient();
    
    const coinParams = {
      name: params.name,
      symbol: params.symbol,
      uri: params.uri,
      payoutRecipient: params.payoutRecipient || account,
      platformReferrer: params.platformReferrer || process.env.NEXT_PUBLIC_PLATFORM_REFERRER || CHAIN_CONFIG.APP_CONFIG?.platformReferrer || account,
      initialPurchaseWei: params.initialPurchaseWei || parseEther("0.01")
    };
    
    console.log("Creating coin with params:", coinParams);
    const result = await createCoinSDK(coinParams, walletClient, publicClient);
    console.log("Coin creation result:", result);
    
    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw new Error(`Failed to create creator coin: ${error.message}`);
  }
}

/**
 * Buy coins using Zora's Coins Protocol
 * @param {Object} params - Buy parameters
 * @param {string} account - Buyer's wallet address
 * @returns {Promise<Object>} - Transaction data
 */
export async function buyCoin(params, account) {
  try {
    const walletClient = await getWalletClient(account);
    const publicClient = getPublicClient();
    
    // First simulate the purchase to get proper parameters
    console.log("Simulating buy with params:", params);
    const simulation = await simulateBuy({
      target: params.coinAddress,
      requestedOrderSize: parseEther(params.amount),
      publicClient,
    });
    console.log("Buy simulation result:", simulation);
    
    // Execute the trade
    const result = await tradeCoin({
      direction: "buy",
      target: params.coinAddress,
      args: {
        recipient: params.recipient || account,
        orderSize: simulation.orderSize,
        minAmountOut: simulation.amountOut * BigInt(95) / BigInt(100), // 5% slippage
        tradeReferrer: params.tradeReferrer || process.env.NEXT_PUBLIC_TRADE_REFERRER || account,
      }
    }, walletClient, publicClient);
    
    console.log("Coin buy result:", result);
    return result;
  } catch (error) {
    console.error("Error buying coin:", error);
    throw new Error(`Failed to buy coin: ${error.message}`);
  }
}

/**
 * Sell coins using Zora's Coins Protocol
 * @param {Object} params - Sell parameters
 * @param {string} account - Seller's wallet address
 * @returns {Promise<Object>} - Transaction data
 */
export async function sellCoin(params, account) {
  try {
    const walletClient = await getWalletClient(account);
    const publicClient = getPublicClient();
    
    // First simulate the sale to get proper parameters
    console.log("Simulating sell with params:", params);
    const simulation = await simulateSell({
      target: params.coinAddress,
      tokenAmount: parseEther(params.amount),
      publicClient,
    });
    console.log("Sell simulation result:", simulation);
    
    // Execute the trade
    const result = await tradeCoin({
      direction: "sell",
      target: params.coinAddress,
      args: {
        recipient: params.recipient || account,
        orderSize: parseEther(params.amount),
        minAmountOut: simulation.amountOut * BigInt(95) / BigInt(100), // 5% slippage
        tradeReferrer: params.tradeReferrer || process.env.NEXT_PUBLIC_TRADE_REFERRER || account,
      }
    }, walletClient, publicClient);
    
    console.log("Coin sell result:", result);
    return result;
  } catch (error) {
    console.error("Error selling coin:", error);
    throw new Error(`Failed to sell coin: ${error.message}`);
  }
}

/**
 * Update coin metadata URI
 * @param {Object} params - Update parameters
 * @param {string} account - Coin owner's wallet address
 * @returns {Promise<Object>} - Transaction data
 */
export async function updateCoinMetadata(params, account) {
  try {
    const walletClient = await getWalletClient(account);
    const publicClient = getPublicClient();
    
    console.log("Updating coin URI with params:", params);
    const result = await updateCoinURI({
      coin: params.coinAddress,
      newURI: params.newURI,
    }, walletClient, publicClient);
    
    console.log("Coin URI update result:", result);
    return result;
  } catch (error) {
    console.error("Error updating coin metadata:", error);
    throw new Error(`Failed to update coin metadata: ${error.message}`);
  }
}

/**
 * Fetch coin details
 * @param {string} coinAddress - Coin contract address
 * @param {number} chainId - Chain ID (defaults to Base Sepolia)
 * @returns {Promise<Object>} - Coin data
 */
export async function fetchCoinDetails(coinAddress, chainId = CHAIN_ID) {
  try {
    console.log(`Fetching coin details for ${coinAddress}`);
    const response = await getCoin({
      address: coinAddress,
      chain: chainId,
    });
    
    return response.data?.zora20Token;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    throw new Error(`Failed to fetch coin details: ${error.message}`);
  }
}

/**
 * Fetch multiple coins
 * @param {Array<string>} coinAddresses - Array of coin addresses
 * @param {number} chainId - Chain ID (defaults to Base Sepolia)
 * @returns {Promise<Array>} - Array of coin data
 */
export async function fetchCoins(coinAddresses, chainId = CHAIN_ID) {
  try {
    console.log(`Fetching details for ${coinAddresses.length} coins`);
    const response = await getCoins({
      coinAddresses,
      chainId,
    });
    
    return response.data?.zora20Tokens;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw new Error(`Failed to fetch coins: ${error.message}`);
  }
}

/**
 * Fetch coin comments
 * @param {string} coinAddress - Coin address
 * @param {Object} options - Options for pagination
 * @returns {Promise<Object>} - Comments data
 */
export async function fetchCoinComments(coinAddress, options = {}) {
  try {
    console.log(`Fetching comments for coin ${coinAddress}`);
    const response = await getCoinComments({
      address: coinAddress,
      chain: options.chainId || CHAIN_ID,
      after: options.after,
      count: options.count || 20,
    });
    
    return response.data?.zora20Token?.zoraComments;
  } catch (error) {
    console.error("Error fetching coin comments:", error);
    throw new Error(`Failed to fetch coin comments: ${error.message}`);
  }
}

/**
 * Fetch trending coins
 * @param {number} limit - Number of coins to fetch
 * @param {string} after - Cursor for pagination
 * @returns {Promise<Object>} - Trending coins data
 */
export async function fetchTrendingCoins(limit = 10, after) {
  try {
    console.log(`Fetching top ${limit} trending coins`);
    const response = await getCoinsTopGainers({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    throw new Error(`Failed to fetch trending coins: ${error.message}`);
  }
}

/**
 * Fetch top volume coins
 * @param {number} limit - Number of coins to fetch
 * @param {string} after - Cursor for pagination
 * @returns {Promise<Object>} - Top volume coins data
 */
export async function fetchTopVolumeCoins(limit = 10, after) {
  try {
    console.log(`Fetching top ${limit} volume coins`);
    const response = await getCoinsTopVolume24h({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching top volume coins:", error);
    throw new Error(`Failed to fetch top volume coins: ${error.message}`);
  }
}

/**
 * Fetch most valuable coins
 * @param {number} limit - Number of coins to fetch
 * @param {string} after - Cursor for pagination
 * @returns {Promise<Object>} - Most valuable coins data
 */
export async function fetchMostValuableCoins(limit = 10, after) {
  try {
    console.log(`Fetching top ${limit} most valuable coins`);
    const response = await getCoinsMostValuable({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching most valuable coins:", error);
    throw new Error(`Failed to fetch most valuable coins: ${error.message}`);
  }
}

/**
 * Fetch new coins
 * @param {number} limit - Number of coins to fetch
 * @param {string} after - Cursor for pagination
 * @returns {Promise<Object>} - New coins data
 */
export async function fetchNewCoins(limit = 10, after) {
  try {
    console.log(`Fetching ${limit} newest coins`);
    const response = await getCoinsNew({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching new coins:", error);
    throw new Error(`Failed to fetch new coins: ${error.message}`);
  }
}

/**
 * Fetch user profile
 * @param {string} identifier - User address or handle
 * @returns {Promise<Object>} - User profile data
 */
export async function fetchUserProfile(identifier) {
  try {
    console.log(`Fetching profile for ${identifier}`);
    const response = await getProfile({
      identifier,
    });
    
    return response.data?.profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

/**
 * Fetch user coin balances
 * @param {string} identifier - User address or handle
 * @param {Object} options - Options for pagination
 * @returns {Promise<Array>} - User coin balances
 */
export async function fetchUserCoinBalances(identifier, options = {}) {
  try {
    console.log(`Fetching coin balances for ${identifier}`);
    const response = await getProfileBalances({
      identifier,
      count: options.count || 20,
      after: options.after,
    });
    
    return response.data?.profile?.coinBalances;
  } catch (error) {
    console.error("Error fetching user coin balances:", error);
    throw new Error(`Failed to fetch user coin balances: ${error.message}`);
  }
}
