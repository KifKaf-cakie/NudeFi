import { 
  createCoin, 
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
  simulateBuy
} from '@zoralabs/coins-sdk';
import { createPublicClient, createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { parseEther, formatEther } from 'viem';

// Configure public client for Base chain
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
});

/**
 * Creates a wallet client with the provided account
 * @param {string} account - User's wallet address
 * @returns {WalletClient} - Viem wallet client
 */
const getWalletClient = (account) => {
  return createWalletClient({
    account,
    chain: base,
    transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  });
};

/**
 * Creates a coin for a creator using Zora Coins Protocol
 * @param {Object} params - Coin creation parameters
 * @param {string} account - Creator's wallet address
 * @returns {Promise<Object>} - Created coin data
 */
export async function createCreatorCoin(params, account) {
  try {
    const walletClient = getWalletClient(account);
    
    const coinParams = {
      name: params.name,
      symbol: params.symbol,
      uri: params.uri,
      payoutRecipient: params.payoutRecipient || account,
      platformReferrer: params.platformReferrer || process.env.NEXT_PUBLIC_PLATFORM_REFERRER || "0x0000000000000000000000000000000000000000",
      initialPurchaseWei: params.initialPurchaseWei || parseEther("0.01")
    };
    
    const result = await createCoin(coinParams, walletClient, publicClient);
    return result;
  } catch (error) {
    console.error("Error creating coin:", error);
    throw error;
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
    const walletClient = getWalletClient(account);
    
    // First simulate the purchase to get proper parameters
    const simulation = await simulateBuy({
      target: params.coinAddress,
      requestedOrderSize: parseEther(params.amount),
      publicClient,
    });
    
    // Execute the trade
    const result = await tradeCoin({
      direction: "buy",
      target: params.coinAddress,
      args: {
        recipient: params.recipient || account,
        orderSize: simulation.orderSize,
        minAmountOut: simulation.amountOut * BigInt(95) / BigInt(100), // 5% slippage
        tradeReferrer: params.tradeReferrer || process.env.NEXT_PUBLIC_TRADE_REFERRER || "0x0000000000000000000000000000000000000000",
      }
    }, walletClient, publicClient);
    
    return result;
  } catch (error) {
    console.error("Error buying coin:", error);
    throw error;
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
    const walletClient = getWalletClient(account);
    
    const result = await tradeCoin({
      direction: "sell",
      target: params.coinAddress,
      args: {
        recipient: params.recipient || account,
        orderSize: parseEther(params.amount),
        minAmountOut: params.minAmountOut || 0n,
        tradeReferrer: params.tradeReferrer || process.env.NEXT_PUBLIC_TRADE_REFERRER || "0x0000000000000000000000000000000000000000",
      }
    }, walletClient, publicClient);
    
    return result;
  } catch (error) {
    console.error("Error selling coin:", error);
    throw error;
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
    const walletClient = getWalletClient(account);
    
    const result = await updateCoinURI({
      coin: params.coinAddress,
      newURI: params.newURI,
    }, walletClient, publicClient);
    
    return result;
  } catch (error) {
    console.error("Error updating coin metadata:", error);
    throw error;
  }
}

/**
 * Fetch coin details
 * @param {string} coinAddress - Coin contract address
 * @param {number} chainId - Chain ID (defaults to Base)
 * @returns {Promise<Object>} - Coin data
 */
export async function fetchCoinDetails(coinAddress, chainId = 8453) {
  try {
    const response = await getCoin({
      address: coinAddress,
      chain: chainId,
    });
    
    return response.data?.zora20Token;
  } catch (error) {
    console.error("Error fetching coin details:", error);
    throw error;
  }
}

/**
 * Fetch multiple coins
 * @param {Array<string>} coinAddresses - Array of coin addresses
 * @param {number} chainId - Chain ID (defaults to Base)
 * @returns {Promise<Array>} - Array of coin data
 */
export async function fetchCoins(coinAddresses, chainId = 8453) {
  try {
    const response = await getCoins({
      coinAddresses,
      chainId,
    });
    
    return response.data?.zora20Tokens;
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw error;
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
    const response = await getCoinComments({
      address: coinAddress,
      chain: options.chainId || 8453,
      after: options.after,
      count: options.count || 20,
    });
    
    return response.data?.zora20Token?.zoraComments;
  } catch (error) {
    console.error("Error fetching coin comments:", error);
    throw error;
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
    const response = await getCoinsTopGainers({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    throw error;
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
    const response = await getCoinsTopVolume24h({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching top volume coins:", error);
    throw error;
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
    const response = await getCoinsMostValuable({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching most valuable coins:", error);
    throw error;
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
    const response = await getCoinsNew({
      count: limit,
      after,
    });
    
    return response.data?.exploreList;
  } catch (error) {
    console.error("Error fetching new coins:", error);
    throw error;
  }
}

/**
 * Fetch user profile
 * @param {string} identifier - User address or handle
 * @returns {Promise<Object>} - User profile data
 */
export async function fetchUserProfile(identifier) {
  try {
    const response = await getProfile({
      identifier,
    });
    
    return response.data?.profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
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
    const response = await getProfileBalances({
      identifier,
      count: options.count || 20,
      after: options.after,
    });
    
    return response.data?.profile?.coinBalances;
  } catch (error) {
    console.error("Error fetching user coin balances:", error);
    throw error;
  }
}
