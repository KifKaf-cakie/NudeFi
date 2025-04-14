import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { 
  createCreatorCoin, 
  buyCoin, 
  sellCoin, 
  updateCoinMetadata,
  fetchCoinDetails,
  fetchCoins,
  fetchCoinComments,
  fetchTrendingCoins,
  fetchTopVolumeCoins,
  fetchMostValuableCoins,
  fetchNewCoins,
  fetchUserProfile,
  fetchUserCoinBalances
} from '../services/zoraService';

/**
 * Custom hook for interacting with Zora Coins Protocol
 * 
 * This hook provides easy access to Zora Coins functionality in React components
 */
export function useZoraCoins() {
  const { address, isConnected } = useAccount();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Create a new creator coin
   * @param {Object} params - Coin creation parameters
   * @returns {Promise<Object>} - Created coin data
   */
  const createCoin = useCallback(async (params) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await createCreatorCoin(params, address);
      return result;
    } catch (err) {
      console.error('Error creating coin:', err);
      setError(err.message || 'Failed to create coin');
      return null;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);
  
  /**
   * Buy a creator coin
   * @param {Object} params - Buy parameters
   * @returns {Promise<Object>} - Transaction data
   */
  const buy = useCallback(async (params) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await buyCoin(params, address);
      return result;
    } catch (err) {
      console.error('Error buying coin:', err);
      setError(err.message || 'Failed to buy coin');
      return null;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);
  
  /**
   * Sell a creator coin
   * @param {Object} params - Sell parameters
   * @returns {Promise<Object>} - Transaction data
   */
  const sell = useCallback(async (params) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await sellCoin(params, address);
      return result;
    } catch (err) {
      console.error('Error selling coin:', err);
      setError(err.message || 'Failed to sell coin');
      return null;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);
  
  /**
   * Update coin metadata URI
   * @param {Object} params - Update parameters
   * @returns {Promise<Object>} - Transaction data
   */
  const updateMetadata = useCallback(async (params) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await updateCoinMetadata(params, address);
      return result;
    } catch (err) {
      console.error('Error updating coin metadata:', err);
      setError(err.message || 'Failed to update coin metadata');
      return null;
    } finally {
      setLoading(false);
    }
  }, [address, isConnected]);
  
  /**
   * Get coin details
   * @param {string} coinAddress - Coin address
   * @returns {Promise<Object>} - Coin details
   */
  const getCoinDetails = useCallback(async (coinAddress) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchCoinDetails(coinAddress);
      return result;
    } catch (err) {
      console.error('Error fetching coin details:', err);
      setError(err.message || 'Failed to fetch coin details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get multiple coins
   * @param {Array<string>} coinAddresses - Array of coin addresses
   * @returns {Promise<Array>} - Array of coin data
   */
  const getCoins = useCallback(async (coinAddresses) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchCoins(coinAddresses);
      return result;
    } catch (err) {
      console.error('Error fetching coins:', err);
      setError(err.message || 'Failed to fetch coins');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get trending coins
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} - Array of trending coins
   */
  const getTrendingCoins = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchTrendingCoins(limit);
      return result;
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError(err.message || 'Failed to fetch trending coins');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get top volume coins
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} - Array of top volume coins
   */
  const getTopVolumeCoins = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchTopVolumeCoins(limit);
      return result;
    } catch (err) {
      console.error('Error fetching top volume coins:', err);
      setError(err.message || 'Failed to fetch top volume coins');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get most valuable coins
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} - Array of most valuable coins
   */
  const getMostValuableCoins = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchMostValuableCoins(limit);
      return result;
    } catch (err) {
      console.error('Error fetching most valuable coins:', err);
      setError(err.message || 'Failed to fetch most valuable coins');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get new coins
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} - Array of new coins
   */
  const getNewCoins = useCallback(async (limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchNewCoins(limit);
      return result;
    } catch (err) {
      console.error('Error fetching new coins:', err);
      setError(err.message || 'Failed to fetch new coins');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get coin comments
   * @param {string} coinAddress - Coin address
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} - Array of comments
   */
  const getCoinComments = useCallback(async (coinAddress, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchCoinComments(coinAddress, options);
      return result;
    } catch (err) {
      console.error('Error fetching coin comments:', err);
      setError(err.message || 'Failed to fetch coin comments');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get user profile
   * @param {string} identifier - User address or handle
   * @returns {Promise<Object>} - User profile data
   */
  const getUserProfile = useCallback(async (identifier) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchUserProfile(identifier);
      return result;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get user coin balances
   * @param {string} identifier - User address or handle
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} - Array of coin balances
   */
  const getUserCoinBalances = useCallback(async (identifier, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchUserCoinBalances(identifier, options);
      return result;
    } catch (err) {
      console.error('Error fetching user coin balances:', err);
      setError(err.message || 'Failed to fetch user coin balances');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Get current user's coin balances
   * @param {Object} options - Pagination options
   * @returns {Promise<Array>} - Array of coin balances
   */
  const getCurrentUserCoinBalances = useCallback(async (options = {}) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      return await getUserCoinBalances(address, options);
    } catch (err) {
      return null;
    }
  }, [address, isConnected, getUserCoinBalances]);
  
  return {
    // State
    loading,
    error,
    address,
    isConnected,
    
    // Coin creation and management
    createCoin,
    buy,
    sell,
    updateMetadata,
    
    // Data fetching
    getCoinDetails,
    getCoins,
    getTrendingCoins,
    getTopVolumeCoins,
    getMostValuableCoins,
    getNewCoins,
    getCoinComments,
    getUserProfile,
    getUserCoinBalances,
    getCurrentUserCoinBalances,
    
    // Reset error
    resetError: () => setError(null)
  };
}
